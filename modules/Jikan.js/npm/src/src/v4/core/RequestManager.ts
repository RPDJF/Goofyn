import * as apiModel from "./apiModels.js";
import { JikanClient } from "./JikanClient.js";
import { Logger } from "../utilities/logger.js";

export class RequestQueue {
  private _queue: (apiModel.APIRequestPromise)[] = [];
  private _size: number = 0;
  private _maxSize: number;

  public get size(): number {
    return this._size;
  }
  public get maxSize(): number {
    return this._maxSize;
  }
  public get isEmpty(): boolean {
    return this._size === 0;
  }
  public get isFull(): boolean {
    return this._size === this._maxSize;
  }

  public constructor(maxSize: number) {
    this._maxSize = maxSize;
  }

  /**
   * enqueue: Add an item to the queue
   *
   * @returns The identifier of the item
   * @throws Error if the queue is full
   */
  protected enqueue(requestPromise: apiModel.APIRequestPromise) {
    if (this._size === this.maxSize && this.maxSize) {
      throw new Error(
        `Internal library request queue is full". Adding context like "Request queue exceeded the limit of ${this.maxSize}`,
        { cause: "QueueFull" },
      );
    }
    this._queue.push(requestPromise);
    this._size++;
  }

  /**
   * dequeue: Remove an item from the queue
   *
   * @returns The item that was removed or undefined if the queue is empty
   */
  protected dequeue(): apiModel.APIRequestPromise | undefined {
    if (this._size === 0) {
      return undefined;
    }
    const item = this._queue.shift();
    this._size--;
    return item;
  }
}

export class RequestManager extends RequestQueue {
  public readonly client: JikanClient;
  private _isProcessing: boolean = false;

  constructor(client: JikanClient) {
    super(client.options.maxPendingRequests);
    this.client = client;
  }

  public buildURL(requestQuery: apiModel.APIRequestQuery): URL {
    return new URL(
      `${this.client.options.host}/${this.client.options.baseUri}/${requestQuery.endpoint}${
        requestQuery.params
          ? `?${new URLSearchParams(requestQuery.params)}`
          : ""
      }`,
    );
  }

  public async processQueue() {
    if (this._isProcessing) return;
    this._isProcessing = true;
    while (!this.isEmpty) {
      const item: apiModel.APIRequestPromise | undefined = this.dequeue();
      if (!item) {
        continue;
      }
      const url: URL = this.buildURL(item.query);
      const response: Promise<Response> = fetch(url, {
        method: item.query.method,
        cache: "no-store",
        signal: AbortSignal.timeout(this.client.options.timeout),
      });
      if (item.resolve) {
        item.resolve(response);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, this.client.options.rateLimit)
      );
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
  public request(requestQuery: apiModel.APIRequestQuery): Promise<Response> {
    return new Promise((resolve) => {
      const requestPromise: apiModel.APIRequestPromise = {
        query: requestQuery,
        resolve: resolve,
      };

      try {
        this.enqueue(requestPromise);
        this.processQueue();
      } catch (e) {
        if (e instanceof Error) {
          if (e.cause === "QueueFull") {
            Logger.error(
              "RequestManager: Queue is full, request dropped",
              requestQuery,
            );
            resolve(
              this._createErrorResponse(
                e.message,
                e.cause,
                503,
                "Service Unavailable",
                this.client.options.rateLimit / 1000,
              ),
            );
          } else {
            Logger.error("RequestManager: Unknown error", e);
            resolve(
              this._createErrorResponse(
                e.message,
                e.cause ? String(e.cause) : "UnknownError",
                500,
                "Internal Server Error",
              ),
            );
          }
        } else {
          Logger.error("RequestManager: Unknown error", e);
          resolve(
            this._createErrorResponse(
              "Unknown error",
              "UnknownError",
              500,
              "Internal Server Error",
            ),
          );
        }
      }
    });
  }

  private _createErrorResponse(
    message: string,
    errorCode: string,
    status: number,
    statusText: string,
    retryAfter?: number,
  ): Response {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (retryAfter) {
      headers.append("Retry-After", retryAfter.toString());
    }

    return new Response(
      JSON.stringify({
        message: message,
        errorCode: errorCode,
        status: status,
        retryAfter: retryAfter,
      }),
      {
        status: status,
        statusText: statusText,
        headers: headers,
      },
    );
  }
}
