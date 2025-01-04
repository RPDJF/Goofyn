import { baseModel, characterModel, userModel } from "../index.js";

export interface AnimeImages {
  jpg?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
  };
  webp?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
  };
}

export interface AnimeMeta extends baseModel.GenericModel {
  images: AnimeImages;
  title: string;
}

export interface TrailerBase {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
}

export interface Trailer extends TrailerBase {
  images?: baseModel.ImageFull;
}

export enum AnimeType {
  TV = "TV",
  OVA = "OVA",
  Movie = "Movie",
  Special = "Special",
  ONA = "ONA",
  Music = "Music",
}

export enum Season {
  Summer = "summer",
  Winter = "winter",
  Spring = "spring",
  Fall = "fall",
}

export interface Theme {
  openings: string[];
  endings: string[];
}

export interface AnimeCharacterRole {
  character: characterModel.CharacterMinimal;
  role: string;
  voice_actors: baseModel.VoiceActors[];
}

export interface AnimeEpisode extends baseModel.GenericModel {
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  filler: boolean;
  recap: boolean;
  forum_url?: string;
}

export interface AnimeEpisodeFull extends baseModel.GenericModel {
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  duration?: number;
  aired?: string;
  filler: boolean;
  recap: boolean;
  synopsis?: string;
}

export interface MusicVideo {
  title: string;
  video: Trailer;
  meta: {
    title?: string;
    author?: string;
  };
}

export interface AnimePromo {
  title: string;
  trailer: Trailer;
}

export interface VideoEpisode extends baseModel.GenericModel {
  title: string;
  episode: string;
  images: baseModel.CommonImage;
}

export interface AnimeVideo {
  promo: AnimePromo[];
  episodes: VideoEpisode[];
  music_videos: MusicVideo[];
}

export interface AnimeStatistics {
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_watch: number;
  total: number;
  scores: baseModel.Score[];
}

export interface AnimeUserUpdate {
  user: userModel.UserMeta;
  score?: number;
  status: string;
  episodes_seen?: number;
  episodes_total?: number;
  date: string;
}

export interface AnimeReview extends baseModel.GenericModel {
  user: userModel.UserMeta;
  type: string;
  reactions: baseModel.Recommendations;
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  episodes_watched: number;
}

export interface Anime extends baseModel.GenericModel {
  Images: AnimeImages;
  trailer: TrailerBase;
  approved: boolean;
  titles: baseModel.Titles[];
  type?: AnimeType;
  source?: string;
  episodes?: number;
  status?: string;
  airing: boolean;
  aired: {
    from?: string;
    to?: string;
  };
  duration?: string;
  rating?:
    | "G - All Ages"
    | "PG - Children"
    | "PG-13 - Teens 13 or older"
    | "R - 17+ (violence & profanity)"
    | "R+ - Mild Nudity"
    | "Rx - Hentai";
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis: string;
  background?: string;
  season?: Season;
  year?: number;
  broadcast: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
  };
  producers: baseModel.MalEntries[];
  licensors: baseModel.MalEntries[];
  studios: baseModel.MalEntries[];
  genres: baseModel.MalEntries[];
  explicit_genres: baseModel.MalEntries[];
  themes: baseModel.MalEntries[];
  demographics: baseModel.MalEntries[];
}

export interface AnimeFull extends Anime {
  relations: baseModel.Relation[];
  theme: Theme;
  external: baseModel.External[];
  streaming: baseModel.External[];
}
