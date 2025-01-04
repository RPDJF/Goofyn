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
const logger_js_1 = require("../../../src/v4/utilities/logger.js");
const deps = __importStar(require("../../test_deps.js"));
function runRequestManagerTests(client) {
    // Will test the request manager from the client
    // Tested:
    // 5 requests are made
    // if all of the requests are made before the rate limit wait time, the test won't pass
    // if all of the requests are made after the rate limit wait time sum, the test will not pass
    dntShim.Deno.test({
        name: "RequestManager rate limit test",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const requestManager = client.requestManager;
        const requests = [
            { endpoint: "anime/1", method: "GET", cache: false },
            { endpoint: "anime/2", method: "GET", cache: false },
            { endpoint: "anime/3", method: "GET", cache: false },
            { endpoint: "anime/4", method: "GET", cache: false },
            { endpoint: "anime/5", method: "GET", cache: false },
        ];
        const start = Date.now();
        const _res = new Promise((resolve, reject) => {
            let count = 0;
            requests.forEach((request) => {
                console.log(deps.blue(`Requesting ${request.endpoint}`));
                const res = requestManager.request(request);
                res.then(() => {
                    count++;
                    console.log(deps.green(`Request ${request.endpoint} done`));
                    if (count === requests.length) {
                        resolve();
                    }
                }).catch(reject);
            });
        });
        await _res.then(() => {
            const end = Date.now();
            const duration = end - start;
            const minTimeout = client.options.rateLimit * (requests.length - 1);
            const maxTimeout = client.options.rateLimit * (requests.length - 1) +
                2000;
            if (duration < minTimeout) {
                throw new Error("The requests were made too fast. Queue system needs to be reviewed.");
            }
            else if (duration > maxTimeout) {
                throw new Error(`The requests were made too slow. Took ${deps.blue(duration + "ms")} when timeout is ${deps.red(maxTimeout + "ms")}. Network may just be slow.`);
            }
        }).catch((err) => {
            throw err;
        });
    });
    // Tested:
    // Flooding the request manager with 2000 requests
    // New client with a rate limit of 5ms
    dntShim.Deno.test({
        name: "RequestManager queue flood test",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const _client = new mod_js_1.JikanClient({
            host: "https://jsonplaceholder.typicode.com",
            rateLimit: 5,
            baseUri: "",
            cacheOptions: {
                cache: false,
            },
        });
        const requestManager = _client.requestManager;
        const requests = [];
        for (let i = 0; i < 2000; i++) {
            requests.push({ endpoint: "posts", method: "GET", cache: false });
        }
        const _res = new Promise((resolve, reject) => {
            let count = 0;
            requests.forEach((request) => {
                const res = requestManager.request(request);
                res.then(() => {
                    count++;
                    if (count === requests.length) {
                        resolve();
                    }
                }).catch(reject);
            });
        });
        await _res.catch((err) => {
            logger_js_1.Logger.error(err);
            throw err;
        });
    });
}
runRequestManagerTests(new mod_js_1.JikanClient());
