"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaManager = void 0;
const index_js_1 = require("../index.js");
/**
 * MangaManager: Manager for the Manga endpoint
 * This component is used to get Manga data from the Jikan API
 */
class MangaManager extends index_js_1.baseManager.BaseManager {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "manga"
        });
    }
    /**
     * getMangas: Get a list of Manga from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getMangas(params) {
        return this._fetchData(this._buildAPIRequestQuery(undefined, params));
    }
    /**
     * getManga: Get a Manga from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getManga(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString()));
    }
    /**
     * getMangaFull: Get a Manga from the Jikan API by its ID with full details
     * @throws Error if status is not between 200 and 300
     */
    getMangaFull(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "full"));
    }
    /**
     * getMangaCharacters: Get a Manga's Characters from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaCharacters(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "characters"));
    }
    /**
     * getMangaNews: Get a Manga's News from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaNews(mangaId, params) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), params, "news"));
    }
    /**
     * getMangaTopics: Get a Manga's Topics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaTopics(mangaId, params) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), params, "forum"));
    }
    /**
     * getMangaPictures: Get a Manga's Pictures from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaPictures(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "pictures"));
    }
    /**
     * getMangaStatistics: Get a Manga's Statistics from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaStatistics(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "statistics"));
    }
    /**
     * getMangaMoreInfo: Get a Manga's More Info from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaMoreInfo(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "moreinfo"));
    }
    /**
     * getMangaRecommendations: Get a Manga's Recommendations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaRecommendations(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "recommendations"));
    }
    /**
     * getMangaUserUpdates: Get a Manga's User Updates from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaUserUpdates(mangaId, params) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), params, "userupdates"));
    }
    /**
     * getMangaReviews: Get a Manga's Reviews from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaReviews(mangaId, params) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), params, "reviews"));
    }
    /**
     * getMangaRelations: Get a Manga's Relations from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaRelations(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "relations"));
    }
    /**
     * getMangaExternals: Get a Manga's Externals from the Jikan API by its ID
     * @throws Error if status is not between 200 and 300
     */
    getMangaExternal(mangaId) {
        return this._fetchData(this._buildAPIRequestQuery(mangaId.toString(), undefined, "external"));
    }
}
exports.MangaManager = MangaManager;
