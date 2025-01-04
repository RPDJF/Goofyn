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
const dntShim = __importStar(require("../../../_dnt.test_shims.js"));
const mod_js_1 = require("../../../src/mod.js");
function runRandomManagerTests(client) {
    // Tested:
    // test each getter method in the RandomManager class through the client
    dntShim.Deno.test({
        name: "RandomManager getters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const promises = [
            client.getAnimeRandom().then((anime) => {
                if (anime.mal_id === 0) {
                    throw new Error("The anime is not defined");
                }
            }),
            client.getMangaRandom().then((manga) => {
                if (manga.mal_id === 0) {
                    throw new Error("The manga is not defined");
                }
            }),
            client.getCharacterRandom().then((character) => {
                if (character.mal_id === 0) {
                    throw new Error("The character is not defined");
                }
            }),
        ];
        await Promise.all(promises);
    });
}
exports.default = runRandomManagerTests;
runRandomManagerTests(new mod_js_1.JikanClient());
