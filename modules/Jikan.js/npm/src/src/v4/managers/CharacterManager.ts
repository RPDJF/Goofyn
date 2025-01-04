import { baseManager, baseModel, characterModel } from "../index.js";

/**
 * CharacterSearchParameters: Interface for Character search parameters
 */
export interface CharacterSearchParameters
  extends baseManager.BaseSearchParameters {
  /**
   * Available Character order_by properties
   */
  order_by?: "mal_id" | "name" | "favorites";
}

/**
 * CharacterManager: Manager class for the Character endpoint
 * This component is used to make requests to the Jikan API's Character endpoint
 */
export class CharacterManager extends baseManager.BaseManager {
  public readonly endpoint: string = "characters";

  /** getCharacters: Get a Character array from the Jikan API
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacters(
    params?: CharacterSearchParameters,
  ): Promise<characterModel.Character[]> {
    return this._fetchData<characterModel.Character[]>(
      this._buildAPIRequestQuery(undefined, params),
    );
  }

  /** getCharacter: Get a Character from the Jikan API by its ID
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacter(characterId: number): Promise<characterModel.Character> {
    return this._fetchData<characterModel.Character>(
      this._buildAPIRequestQuery(characterId.toString()),
    );
  }

  /** getCharacter: Get a CharacterFull from the Jikan API by its ID
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterFull(
    characterId: number,
  ): Promise<characterModel.CharacterFull> {
    return this._fetchData<characterModel.CharacterFull>(
      this._buildAPIRequestQuery(characterId.toString(), undefined, "full"),
    );
  }

  /** getCharacterAnime: Get a Character's Anime from the Jikan API by its ID
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterAnime(
    characterId: number,
  ): Promise<characterModel.AnimeRole[]> {
    return this._fetchData<characterModel.AnimeRole[]>(
      this._buildAPIRequestQuery(characterId.toString(), undefined, "anime"),
    );
  }

  /** getCharacterManga: Get a Character's Manga from the Jikan API by its ID
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterManga(
    characterId: number,
  ): Promise<characterModel.MangaRole[]> {
    return this._fetchData<characterModel.MangaRole[]>(
      this._buildAPIRequestQuery(characterId.toString(), undefined, "manga"),
    );
  }

  /** getCharacterVoiceActors: Get a Character's Voice Actors from the Jikan API by its ID
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterVoiceActors(
    characterId: number,
  ): Promise<baseModel.VoiceActors[]> {
    return this._fetchData<baseModel.VoiceActors[]>(
      this._buildAPIRequestQuery(characterId.toString(), undefined, "voices"),
    );
  }

  /** getCharacterPictures: Get a Character's Pictures from the Jikan API by its ID
   *
   * @throws Error if status is not between 200 and 300
   */
  public getCharacterPictures(
    characterId: number,
  ): Promise<baseModel.CommonImage[]> {
    return this._fetchData<baseModel.CommonImage[]>(
      this._buildAPIRequestQuery(characterId.toString(), undefined, "pictures"),
    );
  }
}
