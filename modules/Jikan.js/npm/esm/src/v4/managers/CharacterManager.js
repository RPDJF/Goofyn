import { baseManager } from "../index.js";
/**
 * CharacterManager: Manager class for the Character endpoint
 * This component is used to make requests to the Jikan API's Character endpoint
 */
export class CharacterManager extends baseManager.BaseManager {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "characters"
        });
    }
    /** getCharacters: Get a Character array from the Jikan API
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacters(params) {
        return this._fetchData(this._buildAPIRequestQuery(undefined, params));
    }
    /** getCharacter: Get a Character from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacter(characterId) {
        return this._fetchData(this._buildAPIRequestQuery(characterId.toString()));
    }
    /** getCharacter: Get a CharacterFull from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterFull(characterId) {
        return this._fetchData(this._buildAPIRequestQuery(characterId.toString(), undefined, "full"));
    }
    /** getCharacterAnime: Get a Character's Anime from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterAnime(characterId) {
        return this._fetchData(this._buildAPIRequestQuery(characterId.toString(), undefined, "anime"));
    }
    /** getCharacterManga: Get a Character's Manga from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterManga(characterId) {
        return this._fetchData(this._buildAPIRequestQuery(characterId.toString(), undefined, "manga"));
    }
    /** getCharacterVoiceActors: Get a Character's Voice Actors from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterVoiceActors(characterId) {
        return this._fetchData(this._buildAPIRequestQuery(characterId.toString(), undefined, "voices"));
    }
    /** getCharacterPictures: Get a Character's Pictures from the Jikan API by its ID
     *
     * @throws Error if status is not between 200 and 300
     */
    getCharacterPictures(characterId) {
        return this._fetchData(this._buildAPIRequestQuery(characterId.toString(), undefined, "pictures"));
    }
}
