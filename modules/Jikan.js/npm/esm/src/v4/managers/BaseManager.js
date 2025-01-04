import { Logger } from "../utilities/logger.js";
/**
 * BaseSort: Enum for base sorting
 */
export var BaseSort;
(function (BaseSort) {
    BaseSort["asc"] = "asc";
    BaseSort["desc"] = "desc";
})(BaseSort || (BaseSort = {}));
/**
 * BaseManager: Base class for all managers
 * This component is an abstract class used to create managers for the Jikan API
 */
export class BaseManager {
    constructor(client) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = client;
        this._cache = client.cacheManager;
    }
    _buildAPIRequestQuery(subPath, searchParams, suffix) {
        const params = new URLSearchParams();
        if (searchParams) {
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value.toString());
                }
            });
        }
        return {
            method: "GET",
            endpoint: `${this.endpoint}${subPath ? `/${subPath}` : ""}${suffix ? `/${suffix}` : ""}`,
            cache: this.endpoint !== "random",
            params: params,
        };
    }
    async _fetchData(query) {
        try {
            const cache = this._cache.get(query);
            if (query.cache && cache) {
                return cache.data;
            }
            const req = await this.client.requestManager.request(query);
            const json = await req.json();
            if (json.status < 200 || json.status >= 300) {
                Logger.error(`Error on APIRequestQuery:`, query);
                Logger.error(`Error fetching data:`, json);
                throw new Error(`Error fetching data: ${json.status} - ${json.message}`);
            }
            if (query.cache) {
                this._cache.set(query, json.data);
            }
            return json.data;
        }
        catch (e) {
            Logger.error(`Error fetching data:`, e);
            throw e;
        }
    }
}
