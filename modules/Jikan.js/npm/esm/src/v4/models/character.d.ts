import { baseModel } from "../index.js";
export interface CharacterImages {
    jpg?: {
        image_url?: string;
        small_image_url?: string;
    };
    webp?: {
        image_url?: string;
        small_image_url?: string;
    };
}
export interface AnimeRole {
    role: string;
    anime: baseModel.Ressource;
}
export interface MangaRole {
    role: string;
    manga: baseModel.Ressource;
}
export interface CharacterMinimal extends baseModel.GenericModel {
    images: CharacterImages;
    name: string;
}
export interface Character extends CharacterMinimal {
    name_kanji?: string;
    nicknames: string[];
    favorites: number;
    about?: string;
}
export interface CharacterFull extends Character {
    anime: AnimeRole[];
    manga: MangaRole[];
    voices: baseModel.VoiceActors[];
}
