import { animeManager, animeModel, baseManager, baseModel, cacheManager, characterManager, characterModel, mangaManager, mangaModel, randomManager, requestManager } from "../index.js";
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
export declare class JikanClient {
    private static setDefaultOptions;
    readonly options: ClientOptions;
    readonly cacheManager: cacheManager.CacheManager;
    readonly requestManager: requestManager.RequestManager;
    readonly characterManager: characterManager.CharacterManager;
    readonly randomManager: randomManager.RandomManager;
    readonly animeManager: animeManager.AnimeManager;
    readonly mangaManager: mangaManager.MangaManager;
    constructor(options?: Partial<ClientOptions>);
    /**
     * getCharacters: Get a Character array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getCharacters(params?: characterManager.CharacterSearchParameters): Promise<characterModel.Character[]>;
    /**
     * getCharacter: Get a Character from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacter(characterId: number): Promise<characterModel.Character>;
    /**
     * getCharacterFull: Get a CharacterFull from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterFull(characterId: number): Promise<characterModel.Character>;
    /**
     * getCharacterAnime: Get a Character's Anime from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterAnime(characterId: number): Promise<characterModel.AnimeRole[]>;
    /**
     * getCharacterManga: Get a Character's Manga from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterManga(characterId: number): Promise<characterModel.MangaRole[]>;
    /**
     * getCharacterVoiceActors: Get a Character's Voice Actors from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterVoiceActors(characterId: number): Promise<baseModel.VoiceActors[]>;
    /**
     * getCharacterPictures: Get a Character's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterPictures(characterId: number): Promise<baseModel.CommonImage[]>;
    /**
     * getAnimes: Get an Anime array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getAnimes(params?: animeManager.AnimeSearchParameters): Promise<animeModel.Anime[]>;
    /**
     * getAnimeFull: Get an AnimeFull from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeFull(animeId: number): Promise<animeModel.AnimeFull>;
    /**
     * getAnime: Get an Anime from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnime(animeId: number): Promise<animeModel.Anime>;
    /**
     * getAnimeCharacters: Get an Anime's Characters from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeCharacters(animeId: number): Promise<animeModel.AnimeCharacterRole[]>;
    /**
     * getAnimeStaff: Get an Anime's Staff from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStaff(animeId: number): Promise<baseModel.Staff[]>;
    /**
     * getAnimeEpisodes: Get an Anime's Episodes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeEpisodes(animeId: number, params?: baseManager.PageSearchParameter): Promise<animeModel.AnimeEpisode[]>;
    /**
     * getAnimeEpisode: Get an Anime's Episode from the Jikan API by its ID and Episode number
     * @throws Error if status is not between 200 and 300
     */
    getAnimeEpisode(animeId: number, episodeNumber: number): Promise<animeModel.AnimeEpisodeFull>;
    /**
     * getAnimeNews: Get an Anime's News from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeNews(animeId: number, params?: baseManager.PageSearchParameter): Promise<baseModel.News[]>;
    /**
     * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeForum(animeId: number): Promise<baseModel.Forum[]>;
    /**
     * getAnimeVideos: Get an Anime's Videos from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeVideos(animeId: number): Promise<animeModel.AnimeVideo>;
    /**
     * getAnimeVideosEpisodes: Get an Anime's Videos Episodes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeVideosEpisodes(animeId: number, params?: baseManager.PageSearchParameter): Promise<animeModel.VideoEpisode[]>;
    /**
     * getAnimePictures: Get an Anime's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimePictures(animeId: number): Promise<baseModel.CommonImage[]>;
    /**
     * getAnimeStatistics: Get an Anime's Statistics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStatistics(animeId: number): Promise<animeModel.AnimeStatistics>;
    /**
     * getAnimeMoreInfo: Get an Anime's More Info from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeMoreInfo(animeId: number): Promise<baseModel.MoreInfo>;
    /**
     * getAnimeRecommendations: Get an Anime's Recommendations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRecommendations(animeId: number): Promise<animeModel.AnimeMeta[]>;
    /**
     * getAnimeUserUpdates: Get an Anime's User Updates from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeUserUpdates(animeId: number): Promise<animeModel.AnimeUserUpdate[]>;
    /**
     * getAnimeReviews: Get an Anime's Reviews from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeReviews(animeId: number, params?: baseManager.ReviewsParameters): Promise<animeModel.AnimeReview[]>;
    /**
     * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRelations(animeId: number): Promise<baseModel.Relation[]>;
    /**
     * getAnimeThemes: Get an Anime's Themes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeThemes(animeId: number): Promise<animeModel.Theme>;
    /**
     * getAnimeExternal: Get an Anime's External Links from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeExternal(animeId: number): Promise<baseModel.External[]>;
    /**
     * getAnimeStreaming: Get an Anime's Streaming Links from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStreaming(animeId: number): Promise<baseModel.External[]>;
    /**
     * getMangas: Get a Manga array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getMangas(params?: mangaManager.MangaSearchParameters): Promise<mangaModel.Manga[]>;
    /**
     * getManga: Get a Manga from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getManga(mangaId: number): Promise<mangaModel.Manga>;
    /**
     * getMangaFull: Get a MangaFull from the Jikan API by its ID
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
    getMangaTopics(mangaId: number, params?: mangaManager.MangaTopicsSearchParameters): Promise<baseModel.Forum[]>;
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
     * getMangaExternal: Get a Manga's External Links from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaExternal(mangaId: number): Promise<baseModel.External[]>;
    /**
     * getAnimeRandom: Get a random Anime from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRandom(): Promise<animeModel.Anime>;
    /**
     * getMangaRandom: Get a random Manga from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getMangaRandom(): Promise<mangaModel.Manga>;
    /**
     * getCharacterRandom: Get a random Character from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getCharacterRandom(): Promise<characterModel.Character>;
}
