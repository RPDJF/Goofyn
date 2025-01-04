import { baseManager, baseModel, characterModel } from "../index.js";
/**
 * CharacterSearchParameters: Interface for Character search parameters
 */
export interface CharacterSearchParameters extends baseManager.BaseSearchParameters {
    /**
     * Available Character order_by properties
     */
    order_by?: "mal_id" | "name" | "favorites";
}
/**
 * CharacterManager: Manager class for the Character endpoint
 * This component is used to make requests to the Jikan API's Character endpoint
 */
export declare class CharacterManager extends baseManager.BaseManager {
    readonly endpoint: string;
    /** getCharacters: Get a Character array from the Jikan API
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacters(params?: CharacterSearchParameters): Promise<characterModel.Character[]>;
    /** getCharacter: Get a Character from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacter(characterId: number): Promise<characterModel.Character>;
    /** getCharacter: Get a CharacterFull from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterFull(characterId: number): Promise<characterModel.CharacterFull>;
    /** getCharacterAnime: Get a Character's Anime from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterAnime(characterId: number): Promise<characterModel.AnimeRole[]>;
    /** getCharacterManga: Get a Character's Manga from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterManga(characterId: number): Promise<characterModel.MangaRole[]>;
    /** getCharacterVoiceActors: Get a Character's Voice Actors from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterVoiceActors(characterId: number): Promise<baseModel.VoiceActors[]>;
    /** getCharacterPictures: Get a Character's Pictures from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterPictures(characterId: number): Promise<baseModel.CommonImage[]>;
}
