import * as dntShim from "../../../_dnt.test_shims.js";
import { JikanClient } from "../../../src/mod.js";
export default function runRandomManagerTests(client) {
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
runRandomManagerTests(new JikanClient());
