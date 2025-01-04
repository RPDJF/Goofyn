import { baseManager, baseModel, mangaModel } from "../index.js";
/**
 * MangaSearchParameters: Interface for Manga search parameters
 */
export interface MangaSearchParameters extends baseManager.BaseSearchParameters {
    /**
     * This is a flag. When supplied it will include entries which are unapproved. Unapproved entries on MyAnimeList are those that are user submitted and have not yet been approved by MAL to show up on other pages. They will have their own specifc pages and are often removed resulting in a 404 error. You do not need to pass a value to it.
     */
    unapproved?: boolean;
    /**
     * Available Manga types
     */
    type?: "manga" | "novel" | "lightnovel" | "oneshot" | "doujin" | "manhwa" | "manhua";
    score?: number;
    /**
     * Set a minimum score for results.
     */
    min_score?: number;
    /**
     * Set a maximum score for results.
     */
    max_score?: number;
    /**
     * Available Manga statuses
     */
    status?: "publishing" | "complete" | "hiatus" | "discontinued" | "upcoming";
    /**
     * Filter out Adult entries
     */
    sfw?: boolean;
    /**
     * Filter by genre(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
     */
    genres?: string;
    /**
     * Exclude genre(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
     */
    genres_exclude?: string;
    /**
     * Available Manga order_by properties
     */
    order_by?: "mal_id" | "title" | "start_date" | "end_date" | "chapters" | "volumes" | "score" | "scored_by" | "rank" | "popularity" | "members" | "favorites";
    /**
     * Filter by magazine(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
     */
    magazine?: string;
    /**
     * Filter by starting date. Format: YYYY-MM-DD. e.g ``2022``, ``2005-05``, ``2005-01-01``
     */
    stard_date?: string;
    /**
     * Filter by ending date. Format: YYYY-MM-DD. e.g ``2022``, ``2005-05``, ``2005-01-01``
     */
    end_date?: string;
}
export interface MangaTopicsSearchParameters {
    filter: "all" | "episode" | "other";
}
/**
 * MangaManager: Manager for the Manga endpoint
 * This component is used to get Manga data from the Jikan API
 */
export declare class MangaManager extends baseManager.BaseManager {
    readonly endpoint: string;
    /**
     * getMangas: Get a list of Manga from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getMangas(params?: MangaSearchParameters): Promise<mangaModel.Manga[]>;
    /**
     * getManga: Get a Manga from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getManga(mangaId: number): Promise<mangaModel.Manga>;
    /**
     * getMangaFull: Get a Manga from the Jikan API by its ID with full details
     * @throws Error if status is not between 200 and 300
     */
    getMangaFull(mangaId: number): Promise<mangaModel.MangaFull>;
    /**
     * getMangaCharacters: Get a Manga's Characters from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaCharacters(mangaId: number): Promise<mangaModel.MangaCharacterRole[]>;
    /**
     * getMangaNews: Get a Manga's News from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaNews(mangaId: number, params?: baseManager.PageSearchParameter): Promise<baseModel.News[]>;
    /**
     * getMangaTopics: Get a Manga's Topics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaTopics(mangaId: number, params?: MangaTopicsSearchParameters): Promise<baseModel.Forum[]>;
    /**
     * getMangaPictures: Get a Manga's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaPictures(mangaId: number): Promise<mangaModel.MangaImages[]>;
    /**
     * getMangaStatistics: Get a Manga's Statistics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaStatistics(mangaId: number): Promise<mangaModel.MangaStatistics>;
    /**
     * getMangaMoreInfo: Get a Manga's More Info from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaMoreInfo(mangaId: number): Promise<baseModel.MoreInfo>;
    /**
     * getMangaRecommendations: Get a Manga's Recommendations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaRecommendations(mangaId: number): Promise<baseModel.MalEntries[]>;
    /**
     * getMangaUserUpdates: Get a Manga's User Updates from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaUserUpdates(mangaId: number, params?: baseManager.PageSearchParameter): Promise<mangaModel.MangaUserUpdate[]>;
    /**
     * getMangaReviews: Get a Manga's Reviews from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaReviews(mangaId: number, params?: baseManager.ReviewsParameters): Promise<mangaModel.MangaReview[]>;
    /**
     * getMangaRelations: Get a Manga's Relations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaRelations(mangaId: number): Promise<baseModel.Relation[]>;
    /**
     * getMangaExternals: Get a Manga's Externals from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaExternal(mangaId: number): Promise<baseModel.External[]>;
}
