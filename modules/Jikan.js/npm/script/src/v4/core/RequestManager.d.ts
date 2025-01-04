/// <reference types="node" />
/// <reference types="node" />
import * as apiModel from "./apiModels.js";
import { JikanClient } from "./JikanClient.js";
export declare class RequestQueue {
    private _queue;
    private _size;
    private _maxSize;
    get size(): number;
    get maxSize(): number;
    get isEmpty(): boolean;
    get isFull(): boolean;
    constructor(maxSize: number);
    /**
     * enqueue: Add an item to the queue
     *
     * @returns The identifier of the item
     * @throws Error if the queue is full
     */
    protected enqueue(requestPromise: apiModel.APIRequestPromise): void;
    /**
     * dequeue: Remove an item from the queue
     *
     * @returns The item that was removed or undefined if the queue is empty
     */
    protected dequeue(): apiModel.APIRequestPromise | undefined;
}
export declare class RequestManager extends RequestQueue {
    readonly client: JikanClient;
    private _isProcessing;
    constructor(client: JikanClient);
    buildURL(requestQuery: apiModel.APIRequestQuery): URL;
    processQueue(): Promise<void>;
    /**
     * request: Enqueue a APIRequestQuery and return a promise of the response
     *
     * note: Request won't retry if the response isn't valid, it's up to the user to handle the response. Maybe a retry mechanism can be added in the future.
     *
     * note: If the queue is full, the request will be dropped and a 503 Service Unavailable response will be returned (see the client options to change the queue size)
     *
     * @returns promise of the response
     */
    request(requestQuery: apiModel.APIRequestQuery): Promise<Response>;
    private _createErrorResponse;
}
