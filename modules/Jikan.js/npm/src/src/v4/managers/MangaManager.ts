import { baseManager, baseModel, mangaModel } from "../index.js";

/**
 * MangaSearchParameters: Interface for Manga search parameters
 */
export interface MangaSearchParameters
  extends baseManager.BaseSearchParameters {
  /**
   * This is a flag. When supplied it will include entries which are unapproved. Unapproved entries on MyAnimeList are those that are user submitted and have not yet been approved by MAL to show up on other pages. They will have their own specifc pages and are often removed resulting in a 404 error. You do not need to pass a value to it.
   */
  unapproved?: boolean;
  /**
   * Available Manga types
   */
  type?:
    | "manga"
    | "novel"
    | "lightnovel"
    | "oneshot"
    | "doujin"
    | "manhwa"
    | "manhua";
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
  order_by?:
    | "mal_id"
    | "title"
    | "start_date"
    | "end_date"
    | "chapters"
    | "volumes"
    | "score"
    | "scored_by"
    | "rank"
    | "popularity"
    | "members"
    | "favorites";
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
export class MangaManager extends baseManager.BaseManager {
  public readonly endpoint: string = "manga";

  /**
   * getMangas: Get a list of Manga from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getMangas(
    params?: MangaSearchParameters,
  ): Promise<mangaModel.Manga[]> {
    return this._fetchData<mangaModel.Manga[]>(
      this._buildAPIRequestQuery(undefined, params),
    );
  }

  /**
   * getManga: Get a Manga from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getManga(mangaId: number): Promise<mangaModel.Manga> {
    return this._fetchData<mangaModel.Manga>(
      this._buildAPIRequestQuery(mangaId.toString()),
    );
  }

  /**
   * getMangaFull: Get a Manga from the Jikan API by its ID with full details
   * @throws Error if status is not between 200 and 300
   */
  public getMangaFull(mangaId: number): Promise<mangaModel.MangaFull> {
    return this._fetchData<mangaModel.MangaFull>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "full"),
    );
  }

  /**
   * getMangaCharacters: Get a Manga's Characters from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaCharacters(
    mangaId: number,
  ): Promise<mangaModel.MangaCharacterRole[]> {
    return this._fetchData<mangaModel.MangaCharacterRole[]>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "characters"),
    );
  }

  /**
   * getMangaNews: Get a Manga's News from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaNews(
    mangaId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<baseModel.News[]> {
    return this._fetchData<baseModel.News[]>(
      this._buildAPIRequestQuery(mangaId.toString(), params, "news"),
    );
  }

  /**
   * getMangaTopics: Get a Manga's Topics from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaTopics(
    mangaId: number,
    params?: MangaTopicsSearchParameters,
  ): Promise<baseModel.Forum[]> {
    return this._fetchData<baseModel.Forum[]>(
      this._buildAPIRequestQuery(mangaId.toString(), params, "forum"),
    );
  }

  /**
   * getMangaPictures: Get a Manga's Pictures from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaPictures(mangaId: number): Promise<mangaModel.MangaImages[]> {
    return this._fetchData<mangaModel.MangaImages[]>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "pictures"),
    );
  }

  /**
   * getMangaStatistics: Get a Manga's Statistics from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaStatistics(
    mangaId: number,
  ): Promise<mangaModel.MangaStatistics> {
    return this._fetchData<mangaModel.MangaStatistics>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "statistics"),
    );
  }

  /**
   * getMangaMoreInfo: Get a Manga's More Info from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaMoreInfo(mangaId: number): Promise<baseModel.MoreInfo> {
    return this._fetchData<baseModel.MoreInfo>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "moreinfo"),
    );
  }

  /**
   * getMangaRecommendations: Get a Manga's Recommendations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaRecommendations(
    mangaId: number,
  ): Promise<baseModel.MalEntries[]> {
    return this._fetchData<baseModel.MalEntries[]>(
      this._buildAPIRequestQuery(
        mangaId.toString(),
        undefined,
        "recommendations",
      ),
    );
  }

  /**
   * getMangaUserUpdates: Get a Manga's User Updates from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaUserUpdates(
    mangaId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<mangaModel.MangaUserUpdate[]> {
    return this._fetchData<mangaModel.MangaUserUpdate[]>(
      this._buildAPIRequestQuery(mangaId.toString(), params, "userupdates"),
    );
  }

  /**
   * getMangaReviews: Get a Manga's Reviews from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaReviews(
    mangaId: number,
    params?: baseManager.ReviewsParameters,
  ): Promise<mangaModel.MangaReview[]> {
    return this._fetchData<mangaModel.MangaReview[]>(
      this._buildAPIRequestQuery(mangaId.toString(), params, "reviews"),
    );
  }

  /**
   * getMangaRelations: Get a Manga's Relations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaRelations(
    mangaId: number,
  ): Promise<baseModel.Relation[]> {
    return this._fetchData<baseModel.Relation[]>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "relations"),
    );
  }

  /**
   * getMangaExternals: Get a Manga's Externals from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaExternal(
    mangaId: number,
  ): Promise<baseModel.External[]> {
    return this._fetchData<baseModel.External[]>(
      this._buildAPIRequestQuery(mangaId.toString(), undefined, "external"),
    );
  }
}
