"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// write tests for the CharacterManager class
const dntShim = __importStar(require("../../../_dnt.test_shims.js"));
const mod_js_1 = require("../../../src/mod.js");
function runCharacterManagerTests(client) {
    // Tested value:
    // is the length of the array 5?
    dntShim.Deno.test({
        name: "CharacterManager.getCharacters without parameters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const characters = await client.getCharacters();
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
        const params = {
            limit: 5,
            order_by: "favorites",
            page: 2,
            sort: "asc",
        };
        const characters = await client.getCharacters(params);
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
runCharacterManagerTests(new mod_js_1.JikanClient());
