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
// write tests for the MangaManager class
const dntShim = __importStar(require("../../../_dnt.test_shims.js"));
const mod_js_1 = require("../../../src/mod.js");
function runMangaManagerTests(client) {
    // Tested value:
    // is the length of the array 5?
    dntShim.Deno.test({
        name: "MangaManager.getMangas without parameters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const Mangas = await client.getMangas();
        if (!Mangas.length) {
            throw new Error("The array is empty");
        }
    });
    // Tested values:
    // is the length of the array 5?
    dntShim.Deno.test({
        name: "MangaManager.getMangas with parameters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const params = {
            limit: 5,
            order_by: "title",
            page: 2,
            sort: "asc",
        };
        const Mangas = await client.getMangas(params);
        if (!Mangas.length) {
            throw new Error("The array is empty");
        }
        if (Mangas.length !== 5) {
            throw new Error("The array length is not 5");
        }
    });
    // Tested:
    // test each getter method in the MangaManager class
    dntShim.Deno.test({
        name: "MangaManager getters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        await Promise.all([
            client.getManga(1).then((Manga) => {
                if (!Manga.mal_id) {
                    throw new Error("The mal_id is not defined");
                }
            }),
            client.getMangaCharacters(1).then((characters) => {
                if (!characters.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaFull(1).then((Manga) => {
                if (!Manga.mal_id) {
                    throw new Error("The mal_id is not defined");
                }
            }),
            client.getMangas().then((Mangas) => {
                if (!Mangas.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaNews(1).then((news) => {
                if (!news.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaTopics(1).then((topics) => {
                if (!topics.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaPictures(1).then((pictures) => {
                if (!pictures.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaStatistics(1).then((statistics) => {
                if (!statistics.scores.length) {
                    throw new Error("The object is empty");
                }
            }),
            client.getMangaMoreInfo(2).then((moreInfo) => {
                if (!moreInfo.moreinfo) {
                    throw new Error("The object is empty");
                }
            }),
            client.getMangaRecommendations(1).then((recommendations) => {
                if (!recommendations.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaUserUpdates(1).then((updates) => {
                if (!updates.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaReviews(1).then((reviews) => {
                if (!reviews.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaRelations(1).then((relations) => {
                if (!relations.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getMangaExternal(1).then((external) => {
                if (!external.length) {
                    throw new Error("The array is empty");
                }
            }),
        ]);
    });
}
runMangaManagerTests(new mod_js_1.JikanClient());
