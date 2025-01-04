import {
  animeModel,
  baseManager,
  characterModel,
  mangaModel,
} from "../index.js";

/**
 * RandomManager: Manager for the Random endpoint
 * This component is used to get random data from the Jikan API
 */
export class RandomManager extends baseManager.BaseManager {
  public readonly endpoint: string = "random";

  /**
   * getRandomAnime: Get a random Anime from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getRandomAnime(): Promise<animeModel.Anime> {
    return this._fetchData<animeModel.Anime>(
      this._buildAPIRequestQuery("anime"),
    );
  }

  /**
   * getRandomManga: Get a random Manga from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getRandomManga(): Promise<mangaModel.Manga> {
    return this._fetchData<mangaModel.Manga>(
      this._buildAPIRequestQuery("manga"),
    );
  }

  /**
   * getRandomCharacter: Get a random Character from the Jikan API
   * @throws Error if status is not between 200 and 300
   */
  public getRandomCharacter(): Promise<characterModel.Character> {
    return this._fetchData<characterModel.Character>(
      this._buildAPIRequestQuery("characters"),
    );
  }
}
