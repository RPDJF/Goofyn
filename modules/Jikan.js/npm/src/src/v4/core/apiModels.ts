/**
 * APIRequestQuery: Interface for API request query
 * This component is used to create a query for an API request
 */
export interface APIRequestQuery {
  method: string;
  endpoint: string;
  cache: boolean;
  params?: Iterable<[string, string]>;
}

/**
 * APIRequestPromise: Interface for API request promises
 * This component is used to create a promise for an API request
 */
export interface APIRequestPromise {
  query: APIRequestQuery;
  resolve: (response: Promise<Response>) => void;
}

export interface APICacheResponse {
  data: JSON;
  expiration: number;
}
