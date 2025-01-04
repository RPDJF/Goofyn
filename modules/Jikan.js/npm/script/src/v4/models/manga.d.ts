import { baseModel, characterModel, userModel } from "../index.js";
export interface MangaImages {
    jpg: {
        image_url?: string;
        small_image_url?: string;
        large_image_url?: string;
    };
    webp: {
        image_url?: string;
        small_image_url?: string;
        large_image_url?: string;
    };
}
export declare enum MangaType {
    Manga = "Manga",
    Novel = "Novel",
    LightNovel = "Light Novel",
    OneShot = "One-shot",
    Doujinshi = "Doujinshi",
    Manhua = "Manhua",
    Manhwa = "Manhwa",
    OEL = "OEL"
}
export declare enum MangaStatus {
    Finished = "Finished",
    Publishing = "Publishing",
    OnHiatus = "On Hiatus",
    Discontinued = "Discontinued",
    NotYetPublished = "Not yet published"
}
export interface MangaCharacterRole {
    character: characterModel.CharacterMinimal;
    role: string;
}
export interface MangaStatistics {
    reading: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_read: number;
    total: number;
    scores: baseModel.Score[];
}
export interface MangaUserUpdate {
    user: userModel.UserMeta;
    score?: number;
    status: string;
    volumes_read: number;
    volumes_total: number;
    chapters_read: number;
    chapters_total: number;
    date: string;
}
export interface MangaReview extends baseModel.GenericModel {
    user: userModel.UserMeta;
    type: string;
    reactions: baseModel.Recommendations;
    date: string;
    review: string;
    score: number;
    tags: string[];
    is_spoiler: boolean;
    is_preliminary: boolean;
}
export interface Manga extends baseModel.GenericModel {
    images: MangaImages;
    approved: boolean;
    titles: baseModel.Titles[];
    type?: MangaType;
    chapters?: number;
    volumes?: number;
    status: MangaStatus;
    publishing: boolean;
    published: baseModel.DateRange;
    score?: number;
    scored_by?: number;
    rank?: number;
    popularity?: number;
    members?: number;
    favorites?: number;
    synopsis?: string;
    background?: string;
    authors: baseModel.MalEntries[];
    serializations: baseModel.MalEntries[];
    genres: baseModel.MalEntries[];
    explicit_genres: baseModel.MalEntries[];
    themes: baseModel.MalEntries[];
    demographics: baseModel.MalEntries[];
}
export interface MangaFull extends Manga {
    relations: baseModel.Relation[];
    external: baseModel.External[];
}
