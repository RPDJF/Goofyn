import * as dntShim from "../../../_dnt.shims.js";
import { JikanClient } from "../index.js";
import { APICacheResponse, APIRequestQuery } from "./apiModels.js";
import { Logger } from "../utilities/logger.js";

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
export class CacheManager {
  private static setDefaultOptions(
    options?: Partial<CacheOptions>,
  ): CacheOptions {
    const defaultOptions: CacheOptions = {
      cacheExpiration: 86400000,
      cache: true,
      deleteCacheOnExit: true,
      cachePath: "",
    };
    return { ...defaultOptions, ...options };
  }

  /**
   * Cache options containing the cache options
   */
  private readonly options: CacheOptions;
  private readonly _client: JikanClient;

  private _getDefaultCache(): string {
    let cache = this.options.cachePath;

    if (!this.options.cachePath) {
      cache = dntShim.Deno.makeTempDirSync({ prefix: "jikanjs_" });
      Logger.info(`CacheManager: Created new cache at ${cache}.`);
    } else {
      dntShim.Deno.mkdirSync(this.options.cachePath, { recursive: true });
      Logger.info(`CacheManager: Using cache at ${cache}.`);
    }

    return cache;
  }
  public constructor(client: JikanClient, options?: Partial<CacheOptions>) {
    this.options = CacheManager.setDefaultOptions(options);
    this._client = client;

    // cache initialization
    if (this.options.cache && !this.options.cachePath) {
      this.options.cachePath = this._getDefaultCache();
      try {
        if (this.options.deleteCacheOnExit) {
          self.addEventListener("unload", () => {
            Logger.warn(
              `CacheManager: Deleting cache... ${this.options.cachePath}`,
            );
            try {
              dntShim.Deno.removeSync(this.options.cachePath, { recursive: true });
            } catch (e) {
              Logger.error(`CacheManager: Error deleting cache: ${e}`);
            }
            Logger.info(`CacheManager: Cache deleted.`);
          });
          dntShim.Deno.addSignalListener("SIGINT", () => {
            Logger.warn(`CacheManager: SIGINT Signal received.`);
            dntShim.Deno.exit(0);
          });
        }
      } catch (e) {
        Logger.error(`CacheManager: Error setting up event listeners: ${e}`);
      }
    }
  }

  public get cachePath(): string {
    return this.options.cachePath;
  }

  public set(query: APIRequestQuery, data: JSON) {
    if (!this.options.cache) {
      return;
    }
    const queryURL = this._client.requestManager.buildURL(query);
    const cacheFile = `${this.options.cachePath}/${
      queryURL.toString().substring(queryURL.origin.length).replace(
        /\/\//g,
        "_",
      ).replace(/\//g, "_").replace(/\?/g, "_")
    }.json`;
    Logger.info(`CacheManager: Caching ${queryURL} to ${cacheFile}`);
    const content: APICacheResponse = {
      data: data,
      expiration: Date.now() + this.options.cacheExpiration,
    };
    dntShim.Deno.writeFileSync(
      cacheFile,
      new TextEncoder().encode(JSON.stringify(content)),
    );
  }

  public get(query: APIRequestQuery): APICacheResponse | null {
    if (!this.options.cache) {
      return null;
    }
    const queryURL = this._client.requestManager.buildURL(query);
    const cacheFile = `${this.options.cachePath}/${
      queryURL.toString().substring(queryURL.origin.length).replace(
        /\/\//g,
        "_",
      ).replace(/\//g, "_").replace(/\?/g, "_")
    }.json`;
    try {
      const content: APICacheResponse = JSON.parse(
        new TextDecoder().decode(dntShim.Deno.readFileSync(cacheFile)),
      );
      if (content.expiration < Date.now()) {
        Logger.info(`CacheManager: Cache expired for ${queryURL}`);
        return null;
      }
      Logger.info(`CacheManager: Cache hit for ${queryURL}`);
      return content;
    } catch (_e) {
      return null;
    }
  }
}
