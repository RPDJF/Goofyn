import * as apiModel from "../core/apiModels.js";
import { JikanClient } from "../index.js";
/**
 * BaseSort: Enum for base sorting
 */
export declare enum BaseSort {
    asc = "asc",
    desc = "desc"
}
/**
 * PageSearchParameter: Interface for page search parameter
 */
export interface PageSearchParameter {
    page?: number;
}
/**
 * BaseSearchParameters: Interface for base search parameters
 */
export interface BaseSearchParameters extends PageSearchParameter {
    limit?: number;
    q?: string;
    /**
     * Search query sort direction
     */
    sort?: "asc" | "desc";
    /**
     * Return entries starting with the specified letter
     */
    letter?: string;
}
/**
 * ReviewsParameters: Interface for Reviews search parameters
 */
export interface ReviewsParameters extends PageSearchParameter {
    preliminary?: boolean;
    spoiler?: boolean;
}
/**
 * BaseManager: Base class for all managers
 * This component is an abstract class used to create managers for the Jikan API
 */
export declare abstract class BaseManager {
    readonly client: JikanClient;
    abstract readonly endpoint: string;
    private readonly _cache;
    constructor(client: JikanClient);
    protected _buildAPIRequestQuery(subPath?: string, searchParams?: BaseSearchParameters | object, suffix?: string): apiModel.APIRequestQuery;
    protected _fetchData<T>(query: apiModel.APIRequestQuery): Promise<T>;
}
