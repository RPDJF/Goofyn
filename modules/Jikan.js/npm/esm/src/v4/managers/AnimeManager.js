import { baseManager } from "../index.js";
/**
 * AnimeForumFilter: Enum for Anime Forum filters
 * (i.e. All, Episode, Other)
 */
export var AnimeForumFilter;
(function (AnimeForumFilter) {
    AnimeForumFilter["All"] = "all";
    AnimeForumFilter["Episode"] = "episode";
    AnimeForumFilter["Other"] = "other";
})(AnimeForumFilter || (AnimeForumFilter = {}));
/**
 * AnimeManager: Manager for Anime
 * This component is used to get Anime data from the Jikan API
 */
export class AnimeManager extends baseManager.BaseManager {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "anime"
        });
    }
    /**
     * getAnimes: Get an Anime array from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getAnimes(params) {
        return this._fetchData(this._buildAPIRequestQuery(undefined, params));
    }
    /**
     * getAnimeFull: Get an AnimeFull from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeFull(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "full"));
    }
    /**
     * getAnime: Get an Anime from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnime(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString()));
    }
    /**
     * getAnimeCharacters: Get an Anime's Characters from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeCharacters(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "characters"));
    }
    /**
     * getAnimeStaff: Get an Anime's Staff from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStaff(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "staff"));
    }
    /**
     * getAnimeEpisodes: Get an Anime's Episodes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeEpisodes(animeId, params) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), params, "episodes"));
    }
    /**
     * getAnimeEpisode: Get an Anime's Episode from the Jikan API by its ID and Episode number
     * @throws Error if status is not between 200 and 300
     */
    getAnimeEpisode(animeId, episodeNumber) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, `episodes/${episodeNumber}`));
    }
    /**
     * getAnimeNews: Get an Anime's News from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeNews(animeId, params) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), params, "news"));
    }
    /**
     * getAnimeForum: Get an Anime's Forum from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeForum(animeId, params) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), params, "forum"));
    }
    /**
     * getAnimeVideos: Get an Anime's Videos from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeVideos(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "videos"));
    }
    /**
     * getAnimeVideosEpisodes: Get an Anime's Videos
     * @throws Error if status is not between 200 and 300
     */
    getAnimeVideosEpisodes(animeId, params) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), params, "videos/episodes"));
    }
    /**
     * getAnimePictures: Get an Anime's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimePictures(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "pictures"));
    }
    /**
     * getAnimeStatistics: Get an Anime's statistics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStatistics(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "statistics"));
    }
    /**
     * getAnimeMoreInfo: Get an Anime's More Info from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeMoreInfo(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "moreinfo"));
    }
    /**
     * getAnimeRecommendations: Get an Anime's Recommendations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRecommendations(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "recommendations"));
    }
    /**
     * getAnimeUserUpdates: Get an Anime's User Updates from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeUserUpdates(animeId, params) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), params, "userupdates"));
    }
    /**
     * getAnimeReviews: Get an Anime's Reviews from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeReviews(animeId, params) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), params, "reviews"));
    }
    /**
     * getAnimeRelations: Get an Anime's Relations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeRelations(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "relations"));
    }
    /**
     * getAnimeThemes: Get an Anime's Themes from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeThemes(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "themes"));
    }
    /**
     * getAnimeExternal: Get an Anime's External from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeExternal(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "external"));
    }
    /**
     * getAnimeStreaming: Get an Anime's Streaming from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getAnimeStreaming(animeId) {
        return this._fetchData(this._buildAPIRequestQuery(animeId.toString(), undefined, "streaming"));
    }
}
