import { animeModel, baseManager, characterModel, mangaModel } from "../index.js";
/**
 * RandomManager: Manager for the Random endpoint
 * This component is used to get random data from the Jikan API
 */
export declare class RandomManager extends baseManager.BaseManager {
    readonly endpoint: string;
    /**
     * getRandomAnime: Get a random Anime from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getRandomAnime(): Promise<animeModel.Anime>;
    /**
     * getRandomManga: Get a random Manga from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getRandomManga(): Promise<mangaModel.Manga>;
    /**
     * getRandomCharacter: Get a random Character from the Jikan API
     * @throws Error if status is not between 200 and 300
     */
    getRandomCharacter(): Promise<characterModel.Character>;
}
