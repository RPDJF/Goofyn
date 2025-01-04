// write tests for the CharacterManager class
import * as dntShim from "../../../_dnt.test_shims.js";


import { JikanClient } from "../../../src/mod.js";
import {
  CharacterSearchParameters,
} from "../../../src/v4/managers/CharacterManager.js";
import { Character } from "../../../src/v4/models/character.js";

function runCharacterManagerTests(client: JikanClient) {
  // Tested value:
  // is the length of the array 5?
  dntShim.Deno.test({
    name: "CharacterManager.getCharacters without parameters",
    sanitizeResources: false,
    sanitizeOps: false,
  }, async () => {
    const characters: Character[] = await client.getCharacters();
    if (!characters.length) {
      throw new Error("The array is empty");
    }
  });

  // Tested values:
  // is the length of the array 5?
  dntShim.Deno.test({
    name: "CharacterManager.getCharacters with parameters",
    sanitizeResources: false,
    sanitizeOps: false,
  }, async () => {
    const params: CharacterSearchParameters = {
      limit: 5,
      order_by: "favorites",
      page: 2,
      sort: "asc",
    };
    const characters: Character[] = await client.getCharacters(params);
    if (!characters.length) {
      throw new Error("The array is empty");
    }
    if (characters.length !== 5) {
      throw new Error("The array length is not 5");
    }
  });

  // Tested:
  // test each getter method in the CharacterManager class
  dntShim.Deno.test({
    name: "CharacterManager getters",
    sanitizeResources: false,
    sanitizeOps: false,
  }, async () => {
    await Promise.all([
      client.getCharacter(1).then((character) => {
        if (!character.mal_id) {
          throw new Error("The mal_id is not defined");
        }
      }),
      client.getCharacterAnime(1).then((anime) => {
        if (!anime.length) {
          throw new Error("The array is empty");
        }
      }),
      client.getCharacterFull(1).then((character) => {
        if (!character.mal_id) {
          throw new Error("The mal_id is not defined");
        }
      }),
      client.getCharacterManga(1).then((manga) => {
        if (!manga.length) {
          throw new Error("The array is empty");
        }
      }),
      client.getCharacterPictures(1).then((pictures) => {
        if (!pictures.length) {
          throw new Error("The array is empty");
        }
      }),
      client.getCharacterVoiceActors(1).then((voiceActors) => {
        if (!voiceActors.length) {
          throw new Error("The array is empty");
        }
      }),
      client.getCharacters().then((characters) => {
        if (!characters.length) {
          throw new Error("The array is empty");
        }
      }),
    ]);
  });
}

runCharacterManagerTests(new JikanClient());
