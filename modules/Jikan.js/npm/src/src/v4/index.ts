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

export * from "./core/JikanClient.js";
export * as cacheManager from "./core/CacheManager.js";
export * as requestManager from "./core/RequestManager.js";
export * as baseManager from "./managers/BaseManager.js";
export * as animeManager from "./managers/AnimeManager.js";
export * as mangaManager from "./managers/MangaManager.js";
export * as characterManager from "./managers/CharacterManager.js";
export * as randomManager from "./managers/RandomManager.js";
export * as baseModel from "./models/base.js";
export * as animeModel from "./models/anime.js";
export * as mangaModel from "./models/manga.js";
export * as characterModel from "./models/character.js";
export * as userModel from "./models/user.js";
