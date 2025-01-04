import { baseManager, } from "../index.js";
/**
 * RandomManager: Manager for the Random endpoint
 * This component is used to get random data from the Jikan API
 */
export class RandomManager extends baseManager.BaseManager {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "random"
        });
    }
    /**
     * getRandomAnime: Get a random Anime from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getRandomAnime() {
        return this._fetchData(this._buildAPIRequestQuery("anime"));
    }
    /**
     * getRandomManga: Get a random Manga from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getRandomManga() {
        return this._fetchData(this._buildAPIRequestQuery("manga"));
    }
    /**
     * getRandomCharacter: Get a random Character from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getRandomCharacter() {
        return this._fetchData(this._buildAPIRequestQuery("characters"));
    }
}
