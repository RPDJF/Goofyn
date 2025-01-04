"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestManager = exports.RequestQueue = void 0;
const logger_js_1 = require("../utilities/logger.js");
class RequestQueue {
    get size() {
        return this._size;
    }
    get maxSize() {
        return this._maxSize;
    }
    get isEmpty() {
        return this._size === 0;
    }
    get isFull() {
        return this._size === this._maxSize;
    }
    constructor(maxSize) {
        Object.defineProperty(this, "_queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._maxSize = maxSize;
    }
    /**
     * enqueue: Add an item to the queue
     *
     * @returns The identifier of the item
     * @throws Error if the queue is full
     */
    enqueue(requestPromise) {
        if (this._size === this.maxSize && this.maxSize) {
            throw new Error(`Internal library request queue is full". Adding context like "Request queue exceeded the limit of ${this.maxSize}`, { cause: "QueueFull" });
        }
        this._queue.push(requestPromise);
        this._size++;
    }
    /**
     * dequeue: Remove an item from the queue
     *
     * @returns The item that was removed or undefined if the queue is empty
     */
    dequeue() {
        if (this._size === 0) {
            return undefined;
        }
        const item = this._queue.shift();
        this._size--;
        return item;
    }
}
exports.RequestQueue = RequestQueue;
class RequestManager extends RequestQueue {
    constructor(client) {
        super(client.options.maxPendingRequests);
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isProcessing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.client = client;
    }
    buildURL(requestQuery) {
        return new URL(`${this.client.options.host}/${this.client.options.baseUri}/${requestQuery.endpoint}${requestQuery.params
            ? `?${new URLSearchParams(requestQuery.params)}`
            : ""}`);
    }
    async processQueue() {
        if (this._isProcessing)
            return;
        this._isProcessing = true;
        while (!this.isEmpty) {
            const item = this.dequeue();
            if (!item) {
                continue;
            }
            const url = this.buildURL(item.query);
            const response = fetch(url, {
                method: item.query.method,
                cache: "no-store",
                signal: AbortSignal.timeout(this.client.options.timeout),
            });
            if (item.resolve) {
                item.resolve(response);
            }
            await new Promise((resolve) => setTimeout(resolve, this.client.options.rateLimit));
        }
        this._isProcessing = false;
    }
    /**
     * request: Enqueue a APIRequestQuery and return a promise of the response
     *
     * note: Request won't retry if the response isn't valid, it's up to the user to handle the response. Maybe a retry mechanism can be added in the future.
     *
     * note: If the queue is full, the request will be dropped and a 503 Service Unavailable response will be returned (see the client options to change the queue size)
     *
     * @returns promise of the response
     */
    request(requestQuery) {
        return new Promise((resolve) => {
            const requestPromise = {
                query: requestQuery,
                resolve: resolve,
            };
            try {
                this.enqueue(requestPromise);
                this.processQueue();
            }
            catch (e) {
                if (e instanceof Error) {
                    if (e.cause === "QueueFull") {
                        logger_js_1.Logger.error("RequestManager: Queue is full, request dropped", requestQuery);
                        resolve(this._createErrorResponse(e.message, e.cause, 503, "Service Unavailable", this.client.options.rateLimit / 1000));
                    }
                    else {
                        logger_js_1.Logger.error("RequestManager: Unknown error", e);
                        resolve(this._createErrorResponse(e.message, e.cause ? String(e.cause) : "UnknownError", 500, "Internal Server Error"));
                    }
                }
                else {
                    logger_js_1.Logger.error("RequestManager: Unknown error", e);
                    resolve(this._createErrorResponse("Unknown error", "UnknownError", 500, "Internal Server Error"));
                }
            }
        });
    }
    _createErrorResponse(message, errorCode, status, statusText, retryAfter) {
        const headers = new Headers({
            "Content-Type": "application/json",
        });
        if (retryAfter) {
            headers.append("Retry-After", retryAfter.toString());
        }
        return new Response(JSON.stringify({
            message: message,
            errorCode: errorCode,
            status: status,
            retryAfter: retryAfter,
        }), {
            status: status,
            statusText: statusText,
            headers: headers,
        });
    }
}
exports.RequestManager = RequestManager;
