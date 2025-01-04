"use strict";
/**
 * ![Jikan.js banner](https://raw.githubusercontent.com/RPDJF/Jikan.js/main/meta/banner.svg)
 *
 * # Jikan.js - Unofficial Jikan API Wrapper for Deno 🚀
 *
 * ![Development Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge&logo=github)
 * ![Test Status](https://raw.githubusercontent.com/RPDJF/Jikan.js/refs/heads/main/meta/statusBadge.svg)
 *
 * ![Deno badge](https://img.shields.io/badge/Deno-464647?style=for-the-badge&logo=deno&logoColor=white)
 * ![TypeScript badge](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
 *
 * **Jikan.js** is a **simple**, **efficient**, and **easy-to-use** library for
 * interacting with the [Jikan API](https://github.com/jikan-me/jikan) — a RESTful
 * API that brings MyAnimeList data to your fingertips!
 *
 * Built with ❤️ in TypeScript, Jikan.js is designed for Deno and comes with
 * powerful features like **rate-limiting**, **caching**, and **self-hosted API
 * support**. Whether you're building the next anime tracker or just want to fetch
 * your favorite characters, Jikan.js has you covered!
 *
 * ⚠️ **Heads up!** This library is still a work in progress. The first release is
 * coming soon, but you're welcome to follow along and share your feedback! 🙌
 *
 * ---
 *
 * ## 🚀 Getting Started
 *
 * ### 🛠️ Importing the Library
 *
 * **Note:** This library isn’t on the Deno registry yet. Stay tuned for updates!
 *
 * To try it out now:
 *
 * ```typescript
 * import { JikanClient } from "https://raw.githubusercontent.com/RPDJF/Jikan.js/refs/heads/main/src/mod.ts";
 * ```
 *
 * ### 🎯 Example Usage
 *
 * Take a look at [JikanClient facade methods](https://rpdjf.github.io/Jikan.js/~/JikanClient.html#methods)
 *
 * Here is an example of how you can use the library to fetch data from the Jikan
 * API:
 *
 * ```typescript
 * const client = new JikanClient();
 *
 * client.getCharacter(1).then((character) => {
 *   console.log(character.name);
 * });
 * ```
 *
 * The library will fully support Jikan API v4, meaning you can make the same queries as you would on the official Jikan API:
 * ```typescript
 * client.getMangas({
 * 	page: 5,
 * 	limit: 5,
 * 	order_by: "popularity",
 * 	sort: "desc",
 * }).then((mangas) => {
 * 	console.log(mangas);
 * });
 * ```
 *
 * **Pro Tip**: The client requests may throw errors, so it’s a good idea to wrap them in a try-catch block:
 *
 * ```typescript
 * try {
 *   const character = await client.getCharacter(1);
 *   console.log(character.name);
 * } catch (error) {
 *   console.error(error);
 * }
 * ```
 *
 * ### 🌐 Self-Hosted Jikan API
 *
 * ```typescript
 * const client = new JikanClient({
 *   host: "https://my-jikan-api.com",
 *   baseUri: "/v4",
 * });
 * ```
 *
 * ### ⚙️ DEBUG Mode
 *
 * You can enable debug mode to see detailed logs:
 * Linux/MacOS:
 * ```bash
 * export DEBUG=true
 * ```
 * Windows:
 * ```cmd
 * set DEBUG=true
 * ```
 *
 * Then simply run your program as usual.
 *
 * ✨ **Let’s build something awesome together!** ✨
 *
 * @module Jikan.js
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.characterModel = exports.mangaModel = exports.animeModel = exports.baseModel = exports.randomManager = exports.characterManager = exports.mangaManager = exports.animeManager = exports.baseManager = exports.requestManager = exports.cacheManager = void 0;
__exportStar(require("./core/JikanClient.js"), exports);
exports.cacheManager = __importStar(require("./core/CacheManager.js"));
exports.requestManager = __importStar(require("./core/RequestManager.js"));
exports.baseManager = __importStar(require("./managers/BaseManager.js"));
exports.animeManager = __importStar(require("./managers/AnimeManager.js"));
exports.mangaManager = __importStar(require("./managers/MangaManager.js"));
exports.characterManager = __importStar(require("./managers/CharacterManager.js"));
exports.randomManager = __importStar(require("./managers/RandomManager.js"));
exports.baseModel = __importStar(require("./models/base.js"));
exports.animeModel = __importStar(require("./models/anime.js"));
exports.mangaModel = __importStar(require("./models/manga.js"));
exports.characterModel = __importStar(require("./models/character.js"));
exports.userModel = __importStar(require("./models/user.js"));
