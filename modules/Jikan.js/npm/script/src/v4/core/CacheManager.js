"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const dntShim = __importStar(require("../../../_dnt.shims.js"));
const logger_js_1 = require("../utilities/logger.js");
/**
 * CacheManager: Manager class for the cache
 * This component is used to manage the cache of the Jikan API
 * The cache isn't implemented yet, the manager only creates a cache directory and deletes it when the program exits
 */
class CacheManager {
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
            logger_js_1.Logger.info(`CacheManager: Created new cache at ${cache}.`);
        }
        else {
            dntShim.Deno.mkdirSync(this.options.cachePath, { recursive: true });
            logger_js_1.Logger.info(`CacheManager: Using cache at ${cache}.`);
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
                        logger_js_1.Logger.warn(`CacheManager: Deleting cache... ${this.options.cachePath}`);
                        try {
                            dntShim.Deno.removeSync(this.options.cachePath, { recursive: true });
                        }
                        catch (e) {
                            logger_js_1.Logger.error(`CacheManager: Error deleting cache: ${e}`);
                        }
                        logger_js_1.Logger.info(`CacheManager: Cache deleted.`);
                    });
                    dntShim.Deno.addSignalListener("SIGINT", () => {
                        logger_js_1.Logger.warn(`CacheManager: SIGINT Signal received.`);
                        dntShim.Deno.exit(0);
                    });
                }
            }
            catch (e) {
                logger_js_1.Logger.error(`CacheManager: Error setting up event listeners: ${e}`);
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
        logger_js_1.Logger.info(`CacheManager: Caching ${queryURL} to ${cacheFile}`);
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
                logger_js_1.Logger.info(`CacheManager: Cache expired for ${queryURL}`);
                return null;
            }
            logger_js_1.Logger.info(`CacheManager: Cache hit for ${queryURL}`);
            return content;
        }
        catch (_e) {
            return null;
        }
    }
}
exports.CacheManager = CacheManager;
