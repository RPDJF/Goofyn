import { animeModel, baseManager, baseModel } from "../index.js";

/**
 * AnimeForumFilter: Enum for Anime Forum filters
 * (i.e. All, Episode, Other)
 */
export enum AnimeForumFilter {
  All = "all",
  Episode = "episode",
  Other = "other",
}

/**
 * AnimeSearchParameters: Interface for Anime search parameters
 */
export interface AnimeSearchParameters
  extends baseManager.BaseSearchParameters {
  /**
   * This is a flag. When supplied it will include entries which are unapproved. Unapproved entries on MyAnimeList are those that are user submitted and have not yet been approved by MAL to show up on other pages. They will have their own specifc pages and are often removed resulting in a 404 error. You do not need to pass a value to it.
   */
  unapproved?: boolean;
  /**
   * Available Anime types
   */
  type?:
    | "tv"
    | "movie"
    | "ova"
    | "special"
    | "ona"
    | "music"
    | "cm"
    | "pv"
    | "tv_special";
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
   * Available Anime statuses
   */
  status?: "airing" | "complete" | "upcoming";
  /**
   * Available Anime audience ratings
   */
  rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
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
   * Available Anime order_by properties
   */
  order_by?:
    | "mal_id"
    | "title"
    | "start_date"
    | "end_date"
    | "episodes"
    | "score"
    | "scored_by"
    | "rank"
    | "popularity"
    | "members"
    | "favorites";
  /**
   * Filter by producers. Can pass multiple with a comma as a delimiter. e.g 1,2,3
   */
  producers?: string;
  /**
   * Filter by starting data. Format: YYYY-MM-DD. e.g ``2022``, ``2005-05``, ``2005-01-01``
   */
  start_date?: string;
  /**
   * Filter by ending data. Format: YYYY-MM-DD. e.g ``2022``, ``2005-05``, ``2005-01-01``
   */
  end_date?: string;
}

/**
 * AnimeForumSearchParameters: Interface for Anime Forum search parameters
 */
export interface AnimeForumSearchParameters {
  filter: AnimeForumFilter | string;
}

/**
 * AnimeManager: Manager for Anime
 * This component is used to get Anime data from the Jikan API
 */
export class AnimeManager extends baseManager.BaseManager {
  public readonly endpoint: string = "anime";

  /**
   * getAnimes: Get an Anime array from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getAnimes(
    params?: AnimeSearchParameters,
  ): Promise<animeModel.Anime[]> {
    return this._fetchData<animeModel.Anime[]>(
      this._buildAPIRequestQuery(undefined, params),
    );
  }
  /**
   * getAnimeFull: Get an AnimeFull from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeFull(animeId: number): Promise<animeModel.AnimeFull> {
    return this._fetchData<animeModel.AnimeFull>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "full"),
    );
  }
  /**
   * getAnime: Get an Anime from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnime(animeId: number): Promise<animeModel.Anime> {
    return this._fetchData<animeModel.Anime>(
      this._buildAPIRequestQuery(animeId.toString()),
    );
  }
  /**
   * getAnimeCharacters: Get an Anime's Characters from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeCharacters(
    animeId: number,
  ): Promise<animeModel.AnimeCharacterRole[]> {
    return this._fetchData<animeModel.AnimeCharacterRole[]>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "characters"),
    );
  }
  /**
   * getAnimeStaff: Get an Anime's Staff from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeStaff(animeId: number): Promise<baseModel.Staff[]> {
    return this._fetchData<baseModel.Staff[]>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "staff"),
    );
  }
  /**
   * getAnimeEpisodes: Get an Anime's Episodes from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeEpisodes(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<animeModel.AnimeEpisode[]> {
    return this._fetchData<animeModel.AnimeEpisode[]>(
      this._buildAPIRequestQuery(animeId.toString(), params, "episodes"),
    );
  }
  /**
   * getAnimeEpisode: Get an Anime's Episode from the Jikan API by its ID and Episode number
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeEpisode(
    animeId: number,
    episodeNumber: number,
  ): Promise<animeModel.AnimeEpisodeFull> {
    return this._fetchData<animeModel.AnimeEpisodeFull>(
      this._buildAPIRequestQuery(
        animeId.toString(),
        undefined,
        `episodes/${episodeNumber}`,
      ),
    );
  }
  /**
   * getAnimeNews: Get an Anime's News from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeNews(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<baseModel.News[]> {
    return this._fetchData<baseModel.News[]>(
      this._buildAPIRequestQuery(animeId.toString(), params, "news"),
    );
  }
  /**
   * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeForum(
    animeId: number,
    params?: AnimeForumSearchParameters,
  ): Promise<baseModel.Forum[]> {
    return this._fetchData<baseModel.Forum[]>(
      this._buildAPIRequestQuery(animeId.toString(), params, "forum"),
    );
  }
  /**
   * getAnimeVideos: Get an Anime's Videos from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeVideos(animeId: number): Promise<animeModel.AnimeVideo> {
    return this._fetchData<animeModel.AnimeVideo>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "videos"),
    );
  }
  /**
   * getAnimeVideosEpisodes: Get an Anime's Videos
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeVideosEpisodes(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<animeModel.VideoEpisode[]> {
    return this._fetchData<animeModel.VideoEpisode[]>(
      this._buildAPIRequestQuery(animeId.toString(), params, "videos/episodes"),
    );
  }
  /**
   * getAnimePictures: Get an Anime's Pictures from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimePictures(animeId: number): Promise<baseModel.CommonImage[]> {
    return this._fetchData<baseModel.CommonImage[]>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "pictures"),
    );
  }
  /**
   * getAnimeStatistics: Get an Anime's statistics from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeStatistics(
    animeId: number,
  ): Promise<animeModel.AnimeStatistics> {
    return this._fetchData<animeModel.AnimeStatistics>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "statistics"),
    );
  }
  /**
   * getAnimeMoreInfo: Get an Anime's More Info from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeMoreInfo(animeId: number): Promise<baseModel.MoreInfo> {
    return this._fetchData<baseModel.MoreInfo>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "moreinfo"),
    );
  }
  /**
   * getAnimeRecommendations: Get an Anime's Recommendations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeRecommendations(
    animeId: number,
  ): Promise<animeModel.AnimeMeta[]> {
    return this._fetchData<animeModel.AnimeMeta[]>(
      this._buildAPIRequestQuery(
        animeId.toString(),
        undefined,
        "recommendations",
      ),
    );
  }
  /**
   * getAnimeUserUpdates: Get an Anime's User Updates from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeUserUpdates(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<animeModel.AnimeUserUpdate[]> {
    return this._fetchData<animeModel.AnimeUserUpdate[]>(
      this._buildAPIRequestQuery(animeId.toString(), params, "userupdates"),
    );
  }
  /**
   * getAnimeReviews: Get an Anime's Reviews from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeReviews(
    animeId: number,
    params?: baseManager.ReviewsParameters,
  ): Promise<animeModel.AnimeReview[]> {
    return this._fetchData<animeModel.AnimeReview[]>(
      this._buildAPIRequestQuery(animeId.toString(), params, "reviews"),
    );
  }
  /**
   * getAnimeRelations: Get an Anime's Relations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeRelations(animeId: number): Promise<baseModel.Relation[]> {
    return this._fetchData<baseModel.Relation[]>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "relations"),
    );
  }
  /**
   * getAnimeThemes: Get an Anime's Themes from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeThemes(animeId: number): Promise<animeModel.Theme> {
    return this._fetchData<animeModel.Theme>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "themes"),
    );
  }
  /**
   * getAnimeExternal: Get an Anime's External from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeExternal(animeId: number): Promise<baseModel.External[]> {
    return this._fetchData<baseModel.External[]>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "external"),
    );
  }
  /**
   * getAnimeStreaming: Get an Anime's Streaming from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeStreaming(animeId: number): Promise<baseModel.External[]> {
    return this._fetchData<baseModel.External[]>(
      this._buildAPIRequestQuery(animeId.toString(), undefined, "streaming"),
    );
  }
}
