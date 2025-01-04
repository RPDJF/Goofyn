import * as dntShim from "../../../_dnt.shims.js";
import { Logger } from "../utilities/logger.js";
/**
 * CacheManager: Manager class for the cache
 * This component is used to manage the cache of the Jikan API
 * The cache isn't implemented yet, the manager only creates a cache directory and deletes it when the program exits
 */
export class CacheManager {
    static setDefaultOptions(options) {
        const defaultOptions = {
            cacheExpiration: 86400000,
            cache: true,
            deleteCacheOnExit: true,
            cachePath: "",
        };
        return { ...defaultOptions, ...options };
    }
    _getDefaultCache() {
        let cache = this.options.cachePath;
        if (!this.options.cachePath) {
            cache = dntShim.Deno.makeTempDirSync({ prefix: "jikanjs_" });
            Logger.info(`CacheManager: Created new cache at ${cache}.`);
        }
        else {
            dntShim.Deno.mkdirSync(this.options.cachePath, { recursive: true });
            Logger.info(`CacheManager: Using cache at ${cache}.`);
        }
        return cache;
    }
    constructor(client, options) {
        /**
         * Cache options containing the cache options
         */
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.options = CacheManager.setDefaultOptions(options);
        this._client = client;
        // cache initialization
        if (this.options.cache && !this.options.cachePath) {
            this.options.cachePath = this._getDefaultCache();
            try {
                if (this.options.deleteCacheOnExit) {
                    self.addEventListener("unload", () => {
                        Logger.warn(`CacheManager: Deleting cache... ${this.options.cachePath}`);
                        try {
                            dntShim.Deno.removeSync(this.options.cachePath, { recursive: true });
                        }
                        catch (e) {
                            Logger.error(`CacheManager: Error deleting cache: ${e}`);
                        }
                        Logger.info(`CacheManager: Cache deleted.`);
                    });
                    dntShim.Deno.addSignalListener("SIGINT", () => {
                        Logger.warn(`CacheManager: SIGINT Signal received.`);
                        dntShim.Deno.exit(0);
                    });
                }
            }
            catch (e) {
                Logger.error(`CacheManager: Error setting up event listeners: ${e}`);
            }
        }
    }
    get cachePath() {
        return this.options.cachePath;
    }
    set(query, data) {
        if (!this.options.cache) {
            return;
        }
        const queryURL = this._client.requestManager.buildURL(query);
        const cacheFile = `${this.options.cachePath}/${queryURL.toString().substring(queryURL.origin.length).replace(/\/\//g, "_").replace(/\//g, "_").replace(/\?/g, "_")}.json`;
        Logger.info(`CacheManager: Caching ${queryURL} to ${cacheFile}`);
        const content = {
            data: data,
            expiration: Date.now() + this.options.cacheExpiration,
        };
        dntShim.Deno.writeFileSync(cacheFile, new TextEncoder().encode(JSON.stringify(content)));
    }
    get(query) {
        if (!this.options.cache) {
            return null;
        }
        const queryURL = this._client.requestManager.buildURL(query);
        const cacheFile = `${this.options.cachePath}/${queryURL.toString().substring(queryURL.origin.length).replace(/\/\//g, "_").replace(/\//g, "_").replace(/\?/g, "_")}.json`;
        try {
            const content = JSON.parse(new TextDecoder().decode(dntShim.Deno.readFileSync(cacheFile)));
            if (content.expiration < Date.now()) {
                Logger.info(`CacheManager: Cache expired for ${queryURL}`);
                return null;
            }
            Logger.info(`CacheManager: Cache hit for ${queryURL}`);
            return content;
        }
        catch (_e) {
            return null;
        }
    }
}
