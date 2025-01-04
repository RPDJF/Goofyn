"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = exports.MangaType = void 0;
var MangaType;
(function (MangaType) {
    MangaType["Manga"] = "Manga";
    MangaType["Novel"] = "Novel";
    MangaType["LightNovel"] = "Light Novel";
    MangaType["OneShot"] = "One-shot";
    MangaType["Doujinshi"] = "Doujinshi";
    MangaType["Manhua"] = "Manhua";
    MangaType["Manhwa"] = "Manhwa";
    MangaType["OEL"] = "OEL";
})(MangaType || (exports.MangaType = MangaType = {}));
var MangaStatus;
(function (MangaStatus) {
    MangaStatus["Finished"] = "Finished";
    MangaStatus["Publishing"] = "Publishing";
    MangaStatus["OnHiatus"] = "On Hiatus";
    MangaStatus["Discontinued"] = "Discontinued";
    MangaStatus["NotYetPublished"] = "Not yet published";
})(MangaStatus || (exports.MangaStatus = MangaStatus = {}));
