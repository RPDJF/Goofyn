import * as dntShim from "../../../_dnt.test_shims.js";
import { JikanClient } from "../../../src/mod.js";

function runCacheManagerTests(client: JikanClient) {
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
    await new Promise((resolve) =>
      setTimeout(resolve, client.options.rateLimit)
    );
  });

  dntShim.Deno.test("Test cache expiration", async () => {
    const cacheExpiration = 1000;
    const _client = new JikanClient({ cacheOptions: { cacheExpiration } });
    await _client.getManga(1);
    await new Promise((resolve) => setTimeout(resolve, cacheExpiration));
    const start = Date.now();
    await _client.getManga(1);
    const end = Date.now();
    const duration = end - start;
    if (duration >= cacheExpiration - 100) {
      throw new Error("The cache expiration is not working");
    }
    await new Promise((resolve) =>
      setTimeout(resolve, _client.options.rateLimit)
    );
  });
}

runCacheManagerTests(new JikanClient());
