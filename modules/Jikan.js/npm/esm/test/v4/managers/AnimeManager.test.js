// write tests for the AnimeManager class
import * as dntShim from "../../../_dnt.test_shims.js";
import { JikanClient } from "../../../src/mod.js";
export default function runAnimeManagerTests(client) {
    // Tested value:
    // is the length of the array 5?
    dntShim.Deno.test({
        name: "AnimeManager.getAnimes without parameters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const animes = await client.getAnimes();
        if (!animes.length) {
            throw new Error("The array is empty");
        }
    });
    // Tested values:
    // is the length of the array 5?
    // is the score of each anime between 4 and 7?
    dntShim.Deno.test({
        name: "AnimeManager.getAnimes with parameters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        const params = {
            limit: 5,
            min_score: 4,
            max_score: 7,
            page: 2,
            sort: "asc",
            status: "complete",
        };
        const animes = await client.getAnimes(params);
        if (!animes.length) {
            throw new Error("The array is empty");
        }
        if (animes.length !== 5) {
            throw new Error("The array length is not 5");
        }
        for (const anime of animes) {
            if (!anime.score) {
                console.warn("The score is not defined");
                continue;
            }
            if (anime.score < 4 || anime.score > 7) {
                throw new Error("The score is not between 4 and 7");
            }
        }
    });
    // Tested:
    // test each getter method in the AnimeManager class
    dntShim.Deno.test({
        name: "AnimeManager getters",
        sanitizeResources: false,
        sanitizeOps: false,
    }, async () => {
        await Promise.all([
            client.getAnime(1).then((anime) => {
                if (!anime.mal_id) {
                    throw new Error("The mal_id is not defined");
                }
            }),
            client.getAnimeCharacters(1).then((characters) => {
                if (!characters.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeEpisode(1, 1).then((episode) => {
                if (!episode.mal_id) {
                    throw new Error("The mal_id is not defined");
                }
            }),
            client.getAnimeEpisodes(1).then((episodes) => {
                if (!episodes.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeExternal(1).then((external) => {
                if (!external.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeForum(1).then((forum) => {
                if (!forum.length) {
                    throw new Error("The mal_id is not defined");
                }
            }),
            client.getAnimeFull(1).then((anime) => {
                if (!anime.mal_id) {
                    throw new Error("The mal_id is not defined");
                }
            }),
            client.getAnimeMoreInfo(1).then((info) => {
                if (!info.moreinfo) {
                    throw new Error("The info is not defined");
                }
            }),
            client.getAnimeNews(1).then((news) => {
                if (!news.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimePictures(1).then((pictures) => {
                if (!pictures.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeRecommendations(1).then((recommendations) => {
                if (!recommendations.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeRelations(1).then((relations) => {
                if (!relations.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeReviews(1).then((reviews) => {
                if (!reviews.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeStaff(1).then((staff) => {
                if (!staff.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeStatistics(1).then((stats) => {
                if (!stats.total) {
                    throw new Error("Stats total is not defined");
                }
            }),
            client.getAnimeStreaming(1).then((streaming) => {
                if (!streaming.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeThemes(1).then((themes) => {
                if (!themes.openings.length || !themes.endings.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeUserUpdates(1).then((updates) => {
                if (!updates.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeVideos(1).then((videos) => {
                if (!videos.episodes.length) {
                    throw new Error("The array is empty");
                }
            }),
            client.getAnimeVideosEpisodes(1).then((episodes) => {
                if (!episodes.length) {
                    throw new Error("The array is empty");
                }
            }),
        ]);
    });
}
runAnimeManagerTests(new JikanClient());
