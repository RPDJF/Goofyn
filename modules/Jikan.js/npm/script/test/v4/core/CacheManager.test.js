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
function runCacheManagerTests(client) {
    // Will test the cache manager from the client
    // Tested:
    // Check if the cache directory is created
    dntShim.Deno.test("CacheManager cache", async () => {
        const _cacheManager = client.cacheManager;
        const _cachePath = _cacheManager.cachePath;
        // Check if the cache directory is created
        const cache = await dntShim.Deno.stat(_cachePath || "");
        if (!cache.isDirectory) {
            throw new Error("The cache directory is not a directory");
        }
    });
    dntShim.Deno.test("Test caching data", async () => {
        const start = Date.now();
        for (let i = 0; i < 6; i++) {
            await client.getManga(1);
        }
        const end = Date.now();
        const duration = end - start;
        if (duration > client.options.rateLimit * 3) {
            throw new Error("The cache is not working");
        }
        await new Promise((resolve) => setTimeout(resolve, client.options.rateLimit));
    });
    dntShim.Deno.test("Test cache expiration", async () => {
        const cacheExpiration = 1000;
        const _client = new mod_js_1.JikanClient({ cacheOptions: { cacheExpiration } });
        await _client.getManga(1);
        await new Promise((resolve) => setTimeout(resolve, cacheExpiration));
        const start = Date.now();
        await _client.getManga(1);
        const end = Date.now();
        const duration = end - start;
        if (duration >= cacheExpiration - 100) {
            throw new Error("The cache expiration is not working");
        }
        await new Promise((resolve) => setTimeout(resolve, _client.options.rateLimit));
    });
}
runCacheManagerTests(new mod_js_1.JikanClient());
