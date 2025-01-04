import {
  animeManager,
  animeModel,
  baseManager,
  baseModel,
  cacheManager,
  characterManager,
  characterModel,
  mangaManager,
  mangaModel,
  randomManager,
  requestManager,
} from "../index.js";

export interface ClientOptions {
  /**
   * Jikan http client host
   * Change it if you want to use a different Jikan API host (e.g. local instance)
   *
   * You also can use non-https host, but it's not recommended
   *
   * Default https://api.jikan.moe
   */
  host: string;

  /**
   * The base pathname for the Jikan API.
   *
   * Use this if you want to use a different Jikan API version
   *
   * Default /v4
   */
  baseUri: string;

  /**
   * The rate limit interval in milliseconds
   *
   * Default is 1050ms (57 requests per minute)
   *
   * Jikan API has a rate limit of 60 requests per minute and 3 requests per second
   */
  rateLimit: number;

  /**
   * Timeout for the request in milliseconds for each request to the Jikan API
   *
   * This timeout isn't used or the internal pending requests queue, it's used for the request to the Jikan API
   *
   * Default 10000ms (10 seconds)
   */
  timeout: number;

  /**
   * Maximum pending requests in the queue
   *
   * This is used to limit the number of requests that can be made at the same time
   *
   * If the queue is full, requests will drop and return a 503 Service Unavailable response
   *
   * If the request is cached, it won't be counted as a pending request
   *
   * Default 0 (no limit)
   */
  maxPendingRequests: number;

  /**
   * Cache options (optional)
   */
  cacheOptions?: Partial<cacheManager.CacheOptions>;
}

/**
 * JikanClient: Main class for the Jikan API client
 * This component is used to interact with the Jikan API using internal managers
 * @example Usage
 * ```typescript
 * const client = new JikanClient();
 *
 * client.getCharacter(1).then((character) => {
 *   console.log(character.name);
 * });
 * ```
 * @example Using a self-hosted Jikan API
 * ```typescript
 * const client = new JikanClient({
 *  host: "https://api.jikan.moe",
 *  baseUri: "/v4",
 * });
 * ```
 */
export class JikanClient {
  private static setDefaultOptions(
    options?: Partial<ClientOptions>,
  ): ClientOptions {
    const defaultOptions: ClientOptions = {
      host: "https://api.jikan.moe",
      baseUri: "/v4",
      rateLimit: 1050,
      timeout: 10000,
      maxPendingRequests: 0,
      cacheOptions: undefined,
    };
    return { ...defaultOptions, ...options };
  }

  public readonly options: ClientOptions;
  public readonly cacheManager: cacheManager.CacheManager;
  public readonly requestManager: requestManager.RequestManager;
  public readonly characterManager: characterManager.CharacterManager;
  public readonly randomManager: randomManager.RandomManager;
  public readonly animeManager: animeManager.AnimeManager;
  public readonly mangaManager: mangaManager.MangaManager;

  public constructor(options?: Partial<ClientOptions>) {
    this.options = JikanClient.setDefaultOptions(options);
    this.cacheManager = new cacheManager.CacheManager(
      this,
      this.options.cacheOptions,
    );
    this.requestManager = new requestManager.RequestManager(this);
    this.characterManager = new characterManager.CharacterManager(this);
    this.animeManager = new animeManager.AnimeManager(this);
    this.mangaManager = new mangaManager.MangaManager(this);
    this.randomManager = new randomManager.RandomManager(this);
  }

  // Facade methods for the CharacterManager
  /**
   * getCharacters: Get a Character array from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getCharacters(
    params?: characterManager.CharacterSearchParameters,
  ): Promise<characterModel.Character[]> {
    return this.characterManager.getCharacters(params);
  }
  /**
   * getCharacter: Get a Character from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getCharacter(characterId: number): Promise<characterModel.Character> {
    return this.characterManager.getCharacter(characterId);
  }
  /**
   * getCharacterFull: Get a CharacterFull from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterFull(
    characterId: number,
  ): Promise<characterModel.Character> {
    return this.characterManager.getCharacterFull(characterId);
  }
  /**
   * getCharacterAnime: Get a Character's Anime from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterAnime(
    characterId: number,
  ): Promise<characterModel.AnimeRole[]> {
    return this.characterManager.getCharacterAnime(characterId);
  }
  /**
   * getCharacterManga: Get a Character's Manga from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterManga(
    characterId: number,
  ): Promise<characterModel.MangaRole[]> {
    return this.characterManager.getCharacterManga(characterId);
  }
  /**
   * getCharacterVoiceActors: Get a Character's Voice Actors from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterVoiceActors(
    characterId: number,
  ): Promise<baseModel.VoiceActors[]> {
    return this.characterManager.getCharacterVoiceActors(characterId);
  }
  /**
   * getCharacterPictures: Get a Character's Pictures from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterPictures(
    characterId: number,
  ): Promise<baseModel.CommonImage[]> {
    return this.characterManager.getCharacterPictures(characterId);
  }

  // Facade methods for the AnimeManager
  /**
   * getAnimes: Get an Anime array from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getAnimes(
    params?: animeManager.AnimeSearchParameters,
  ): Promise<animeModel.Anime[]> {
    return this.animeManager.getAnimes(params);
  }
  /**
   * getAnimeFull: Get an AnimeFull from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeFull(animeId: number): Promise<animeModel.AnimeFull> {
    return this.animeManager.getAnimeFull(animeId);
  }
  /**
   * getAnime: Get an Anime from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnime(animeId: number): Promise<animeModel.Anime> {
    return this.animeManager.getAnime(animeId);
  }
  /**
   * getAnimeCharacters: Get an Anime's Characters from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeCharacters(
    animeId: number,
  ): Promise<animeModel.AnimeCharacterRole[]> {
    return this.animeManager.getAnimeCharacters(animeId);
  }
  /**
   * getAnimeStaff: Get an Anime's Staff from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeStaff(animeId: number): Promise<baseModel.Staff[]> {
    return this.animeManager.getAnimeStaff(animeId);
  }
  /**
   * getAnimeEpisodes: Get an Anime's Episodes from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeEpisodes(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<animeModel.AnimeEpisode[]> {
    return this.animeManager.getAnimeEpisodes(animeId, params);
  }
  /**
   * getAnimeEpisode: Get an Anime's Episode from the Jikan API by its ID and Episode number
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeEpisode(
    animeId: number,
    episodeNumber: number,
  ): Promise<animeModel.AnimeEpisodeFull> {
    return this.animeManager.getAnimeEpisode(animeId, episodeNumber);
  }
  /**
   * getAnimeNews: Get an Anime's News from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeNews(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<baseModel.News[]> {
    return this.animeManager.getAnimeNews(animeId, params);
  }
  /**
   * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeForum(animeId: number): Promise<baseModel.Forum[]> {
    return this.animeManager.getAnimeForum(animeId);
  }
  /**
   * getAnimeVideos: Get an Anime's Videos from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeVideos(animeId: number): Promise<animeModel.AnimeVideo> {
    return this.animeManager.getAnimeVideos(animeId);
  }
  /**
   * getAnimeVideosEpisodes: Get an Anime's Videos Episodes from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeVideosEpisodes(
    animeId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<animeModel.VideoEpisode[]> {
    return this.animeManager.getAnimeVideosEpisodes(animeId, params);
  }
  /**
   * getAnimePictures: Get an Anime's Pictures from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimePictures(animeId: number): Promise<baseModel.CommonImage[]> {
    return this.animeManager.getAnimePictures(animeId);
  }
  /**
   * getAnimeStatistics: Get an Anime's Statistics from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeStatistics(
    animeId: number,
  ): Promise<animeModel.AnimeStatistics> {
    return this.animeManager.getAnimeStatistics(animeId);
  }
  /**
   * getAnimeMoreInfo: Get an Anime's More Info from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeMoreInfo(animeId: number): Promise<baseModel.MoreInfo> {
    return this.animeManager.getAnimeMoreInfo(animeId);
  }
  /**
   * getAnimeRecommendations: Get an Anime's Recommendations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeRecommendations(
    animeId: number,
  ): Promise<animeModel.AnimeMeta[]> {
    return this.animeManager.getAnimeRecommendations(animeId);
  }
  /**
   * getAnimeUserUpdates: Get an Anime's User Updates from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeUserUpdates(
    animeId: number,
  ): Promise<animeModel.AnimeUserUpdate[]> {
    return this.animeManager.getAnimeUserUpdates(animeId);
  }
  /**
   * getAnimeReviews: Get an Anime's Reviews from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeReviews(
    animeId: number,
    params?: baseManager.ReviewsParameters,
  ): Promise<animeModel.AnimeReview[]> {
    return this.animeManager.getAnimeReviews(animeId, params);
  }
  /**
   * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeRelations(animeId: number): Promise<baseModel.Relation[]> {
    return this.animeManager.getAnimeRelations(animeId);
  }
  /**
   * getAnimeThemes: Get an Anime's Themes from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeThemes(animeId: number): Promise<animeModel.Theme> {
    return this.animeManager.getAnimeThemes(animeId);
  }
  /**
   * getAnimeExternal: Get an Anime's External Links from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeExternal(animeId: number): Promise<baseModel.External[]> {
    return this.animeManager.getAnimeExternal(animeId);
  }
  /**
   * getAnimeStreaming: Get an Anime's Streaming Links from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeStreaming(animeId: number): Promise<baseModel.External[]> {
    return this.animeManager.getAnimeStreaming(animeId);
  }

  // Facade methods for the MangaManager
  /**
   * getMangas: Get a Manga array from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getMangas(
    params?: mangaManager.MangaSearchParameters,
  ): Promise<mangaModel.Manga[]> {
    return this.mangaManager.getMangas(params);
  }
  /**
   * getManga: Get a Manga from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getManga(mangaId: number): Promise<mangaModel.Manga> {
    return this.mangaManager.getManga(mangaId);
  }
  /**
   * getMangaFull: Get a MangaFull from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaFull(mangaId: number): Promise<mangaModel.MangaFull> {
    return this.mangaManager.getMangaFull(mangaId);
  }
  /**
   * getMangaCharacters: Get a Manga's Characters from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaCharacters(
    mangaId: number,
  ): Promise<mangaModel.MangaCharacterRole[]> {
    return this.mangaManager.getMangaCharacters(mangaId);
  }
  /**
   * getMangaNews: Get a Manga's News from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaNews(
    mangaId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<baseModel.News[]> {
    return this.mangaManager.getMangaNews(mangaId, params);
  }
  /**
   * getMangaTopics: Get a Manga's Topics from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaTopics(
    mangaId: number,
    params?: mangaManager.MangaTopicsSearchParameters,
  ): Promise<baseModel.Forum[]> {
    return this.mangaManager.getMangaTopics(mangaId, params);
  }
  /**
   * getMangaPictures: Get a Manga's Pictures from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaPictures(mangaId: number): Promise<mangaModel.MangaImages[]> {
    return this.mangaManager.getMangaPictures(mangaId);
  }
  /**
   * getMangaStatistics: Get a Manga's Statistics from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaStatistics(
    mangaId: number,
  ): Promise<mangaModel.MangaStatistics> {
    return this.mangaManager.getMangaStatistics(mangaId);
  }
  /**
   * getMangaMoreInfo: Get a Manga's More Info from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaMoreInfo(mangaId: number): Promise<baseModel.MoreInfo> {
    return this.mangaManager.getMangaMoreInfo(mangaId);
  }
  /**
   * getMangaRecommendations: Get a Manga's Recommendations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaRecommendations(
    mangaId: number,
  ): Promise<baseModel.MalEntries[]> {
    return this.mangaManager.getMangaRecommendations(mangaId);
  }
  /**
   * getMangaUserUpdates: Get a Manga's User Updates from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaUserUpdates(
    mangaId: number,
    params?: baseManager.PageSearchParameter,
  ): Promise<mangaModel.MangaUserUpdate[]> {
    return this.mangaManager.getMangaUserUpdates(mangaId, params);
  }
  /**
   * getMangaReviews: Get a Manga's Reviews from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaReviews(
    mangaId: number,
    params?: baseManager.ReviewsParameters,
  ): Promise<mangaModel.MangaReview[]> {
    return this.mangaManager.getMangaReviews(mangaId, params);
  }
  /**
   * getMangaRelations: Get a Manga's Relations from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaRelations(mangaId: number): Promise<baseModel.Relation[]> {
    return this.mangaManager.getMangaRelations(mangaId);
  }
  /**
   * getMangaExternal: Get a Manga's External Links from the Jikan API by its ID
   * @throws Error if status is not between 200 and 300
   */
  public getMangaExternal(mangaId: number): Promise<baseModel.External[]> {
    return this.mangaManager.getMangaExternal(mangaId);
  }

  // Facade methods for the RandomManager
  /**
   * getAnimeRandom: Get a random Anime from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getAnimeRandom(): Promise<animeModel.Anime> {
    return this.randomManager.getRandomAnime();
  }
  /**
   * getMangaRandom: Get a random Manga from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getMangaRandom(): Promise<mangaModel.Manga> {
    return this.randomManager.getRandomManga();
  }
  /**
   * getCharacterRandom: Get a random Character from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterRandom(): Promise<characterModel.Character> {
    return this.randomManager.getRandomCharacter();
  }
}
