import { JikanClient } from "../index.js";
import { APICacheResponse, APIRequestQuery } from "./apiModels.js";
export interface CacheOptions {
    /**
     * Cache expiration time in milliseconds
     *
     * This is used to cache the response from the Jikan API, cache response won't be rate limited if it's still valid
     *
     * Any modification of this value will be ignored during the program execution
     *
     * Default 86400000 (1 day)
     */
    cacheExpiration: number;
    /**
     * Enable or disable the cache
     *
     * Because of the limited rate limit of the Jikan API, it's recommended to enable the cache
     *
     * Default true
     */
    cache: boolean;
    /**
     * Delete the cache when the program exits
     *
     * note: Due to an issue with Deno, this option will add an event listener to the SIGINT signal in order exit the program and delete the cache
     *
     * Any modification of this value will be ignored during the program execution
     *
     * Default true
     */
    deleteCacheOnExit: boolean;
    /**
     * Data path for the cache
     *
     * Default is the system temp directory
     *
     * Any modification of this value will be ignored during the program execution
     */
    cachePath: string;
}
/**
 * CacheManager: Manager class for the cache
 * This component is used to manage the cache of the Jikan API
 * The cache isn't implemented yet, the manager only creates a cache directory and deletes it when the program exits
 */
export declare class CacheManager {
    private static setDefaultOptions;
    /**
     * Cache options containing the cache options
     */
    private readonly options;
    private readonly _client;
    private _getDefaultCache;
    constructor(client: JikanClient, options?: Partial<CacheOptions>);
    get cachePath(): string;
    set(query: APIRequestQuery, data: JSON): void;
    get(query: APIRequestQuery): APICacheResponse | null;
}
