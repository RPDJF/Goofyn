"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JikanClient = void 0;
const index_js_1 = require("../index.js");
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
class JikanClient {
    static setDefaultOptions(options) {
        const defaultOptions = {
            host: "https://api.jikan.moe",
            baseUri: "/v4",
            rateLimit: 1050,
            timeout: 10000,
            maxPendingRequests: 0,
            cacheOptions: undefined,
        };
        return { ...defaultOptions, ...options };
    }
    constructor(options) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cacheManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "characterManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "randomManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animeManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mangaManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.options = JikanClient.setDefaultOptions(options);
        this.cacheManager = new index_js_1.cacheManager.CacheManager(this, this.options.cacheOptions);
        this.requestManager = new index_js_1.requestManager.RequestManager(this);
        this.characterManager = new index_js_1.characterManager.CharacterManager(this);
        this.animeManager = new index_js_1.animeManager.AnimeManager(this);
        this.mangaManager = new index_js_1.mangaManager.MangaManager(this);
        this.randomManager = new index_js_1.randomManager.RandomManager(this);
    }
    // Facade methods for the CharacterManager
    /**
     * getCharacters: Get a Character array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getCharacters(params) {
        return this.characterManager.getCharacters(params);
    }
    /**
     * getCharacter: Get a Character from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacter(characterId) {
        return this.characterManager.getCharacter(characterId);
    }
    /**
     * getCharacterFull: Get a CharacterFull from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterFull(characterId) {
        return this.characterManager.getCharacterFull(characterId);
    }
    /**
     * getCharacterAnime: Get a Character's Anime from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterAnime(characterId) {
        return this.characterManager.getCharacterAnime(characterId);
    }
    /**
     * getCharacterManga: Get a Character's Manga from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterManga(characterId) {
        return this.characterManager.getCharacterManga(characterId);
    }
    /**
     * getCharacterVoiceActors: Get a Character's Voice Actors from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterVoiceActors(characterId) {
        return this.characterManager.getCharacterVoiceActors(characterId);
    }
    /**
     * getCharacterPictures: Get a Character's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getCharacterPictures(characterId) {
        return this.characterManager.getCharacterPictures(characterId);
    }
    // Facade methods for the AnimeManager
    /**
     * getAnimes: Get an Anime array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getAnimes(params) {
        return this.animeManager.getAnimes(params);
    }
    /**
     * getAnimeFull: Get an AnimeFull from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeFull(animeId) {
        return this.animeManager.getAnimeFull(animeId);
    }
    /**
     * getAnime: Get an Anime from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnime(animeId) {
        return this.animeManager.getAnime(animeId);
    }
    /**
     * getAnimeCharacters: Get an Anime's Characters from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeCharacters(animeId) {
        return this.animeManager.getAnimeCharacters(animeId);
    }
    /**
     * getAnimeStaff: Get an Anime's Staff from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStaff(animeId) {
        return this.animeManager.getAnimeStaff(animeId);
    }
    /**
     * getAnimeEpisodes: Get an Anime's Episodes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeEpisodes(animeId, params) {
        return this.animeManager.getAnimeEpisodes(animeId, params);
    }
    /**
     * getAnimeEpisode: Get an Anime's Episode from the Jikan API by its ID and Episode number
     * @throws Error if status is not between 200 and 300
     */
    getAnimeEpisode(animeId, episodeNumber) {
        return this.animeManager.getAnimeEpisode(animeId, episodeNumber);
    }
    /**
     * getAnimeNews: Get an Anime's News from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeNews(animeId, params) {
        return this.animeManager.getAnimeNews(animeId, params);
    }
    /**
     * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeForum(animeId) {
        return this.animeManager.getAnimeForum(animeId);
    }
    /**
     * getAnimeVideos: Get an Anime's Videos from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeVideos(animeId) {
        return this.animeManager.getAnimeVideos(animeId);
    }
    /**
     * getAnimeVideosEpisodes: Get an Anime's Videos Episodes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeVideosEpisodes(animeId, params) {
        return this.animeManager.getAnimeVideosEpisodes(animeId, params);
    }
    /**
     * getAnimePictures: Get an Anime's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimePictures(animeId) {
        return this.animeManager.getAnimePictures(animeId);
    }
    /**
     * getAnimeStatistics: Get an Anime's Statistics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStatistics(animeId) {
        return this.animeManager.getAnimeStatistics(animeId);
    }
    /**
     * getAnimeMoreInfo: Get an Anime's More Info from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeMoreInfo(animeId) {
        return this.animeManager.getAnimeMoreInfo(animeId);
    }
    /**
     * getAnimeRecommendations: Get an Anime's Recommendations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRecommendations(animeId) {
        return this.animeManager.getAnimeRecommendations(animeId);
    }
    /**
     * getAnimeUserUpdates: Get an Anime's User Updates from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeUserUpdates(animeId) {
        return this.animeManager.getAnimeUserUpdates(animeId);
    }
    /**
     * getAnimeReviews: Get an Anime's Reviews from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeReviews(animeId, params) {
        return this.animeManager.getAnimeReviews(animeId, params);
    }
    /**
     * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRelations(animeId) {
        return this.animeManager.getAnimeRelations(animeId);
    }
    /**
     * getAnimeThemes: Get an Anime's Themes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeThemes(animeId) {
        return this.animeManager.getAnimeThemes(animeId);
    }
    /**
     * getAnimeExternal: Get an Anime's External Links from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeExternal(animeId) {
        return this.animeManager.getAnimeExternal(animeId);
    }
    /**
     * getAnimeStreaming: Get an Anime's Streaming Links from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStreaming(animeId) {
        return this.animeManager.getAnimeStreaming(animeId);
    }
    // Facade methods for the MangaManager
    /**
     * getMangas: Get a Manga array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getMangas(params) {
        return this.mangaManager.getMangas(params);
    }
    /**
     * getManga: Get a Manga from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getManga(mangaId) {
        return this.mangaManager.getManga(mangaId);
    }
    /**
     * getMangaFull: Get a MangaFull from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaFull(mangaId) {
        return this.mangaManager.getMangaFull(mangaId);
    }
    /**
     * getMangaCharacters: Get a Manga's Characters from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaCharacters(mangaId) {
        return this.mangaManager.getMangaCharacters(mangaId);
    }
    /**
     * getMangaNews: Get a Manga's News from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaNews(mangaId, params) {
        return this.mangaManager.getMangaNews(mangaId, params);
    }
    /**
     * getMangaTopics: Get a Manga's Topics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaTopics(mangaId, params) {
        return this.mangaManager.getMangaTopics(mangaId, params);
    }
    /**
     * getMangaPictures: Get a Manga's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaPictures(mangaId) {
        return this.mangaManager.getMangaPictures(mangaId);
    }
    /**
     * getMangaStatistics: Get a Manga's Statistics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaStatistics(mangaId) {
        return this.mangaManager.getMangaStatistics(mangaId);
    }
    /**
     * getMangaMoreInfo: Get a Manga's More Info from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaMoreInfo(mangaId) {
        return this.mangaManager.getMangaMoreInfo(mangaId);
    }
    /**
     * getMangaRecommendations: Get a Manga's Recommendations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaRecommendations(mangaId) {
        return this.mangaManager.getMangaRecommendations(mangaId);
    }
    /**
     * getMangaUserUpdates: Get a Manga's User Updates from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaUserUpdates(mangaId, params) {
        return this.mangaManager.getMangaUserUpdates(mangaId, params);
    }
    /**
     * getMangaReviews: Get a Manga's Reviews from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaReviews(mangaId, params) {
        return this.mangaManager.getMangaReviews(mangaId, params);
    }
    /**
     * getMangaRelations: Get a Manga's Relations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaRelations(mangaId) {
        return this.mangaManager.getMangaRelations(mangaId);
    }
    /**
     * getMangaExternal: Get a Manga's External Links from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaExternal(mangaId) {
        return this.mangaManager.getMangaExternal(mangaId);
    }
    // Facade methods for the RandomManager
    /**
     * getAnimeRandom: Get a random Anime from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRandom() {
        return this.randomManager.getRandomAnime();
    }
    /**
     * getMangaRandom: Get a random Manga from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getMangaRandom() {
        return this.randomManager.getRandomManga();
    }
    /**
     * getCharacterRandom: Get a random Character from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getCharacterRandom() {
        return this.randomManager.getRandomCharacter();
    }
}
exports.JikanClient = JikanClient;
