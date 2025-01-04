export interface CommonImage {
  jpg?: {
    image_url?: string;
  };
}

export interface ImageFull {
  image_url?: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

export interface GenericModel {
  mal_id: number;
  url: string;
}

export interface MalEntries extends GenericModel {
  type: string;
  name: string;
}

export interface Ressource {
  mal_id: number;
  url: string;
  images: CommonImage;
  title: string;
}

export interface Person {
  mal_id: number;
  url: string;
  images: CommonImage;
  name: string;
}

export interface VoiceActors {
  language: string;
  person: Person;
}

export interface Staff {
  person: Person;
  positions: string[];
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

export interface Titles {
  type: string;
  title: string;
}

export interface DateProp {
  day?: number;
  month?: number;
  year?: number;
}

export interface DateRange {
  /**
   * Date ISO8601
   */
  from?: string;
  /**
   * Date ISO8601
   */
  to?: string;
  prop: {
    from: DateProp;
    to: DateProp;
    string?: string;
  };
}

export interface Relation {
  relation: string;
  entry: MalEntries[];
}

export interface External {
  name: string;
  url: string;
}

export interface News extends GenericModel {
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  form_url: string;
  images: CommonImage;
  comments: number;
  excerpt: string;
}

export interface LastComment {
  url: string;
  author_username: string;
  author_url: string;
  date?: string;
}

export interface Forum extends GenericModel {
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  comments: number;
  last_comment: LastComment;
}

export interface Score {
  score: number;
  votes: number;
  percentage: number;
}

export interface MoreInfo {
  moreinfo?: string;
}

export interface Recommendations {
  overall: number;
  nice: number;
  love_it: number;
  funny: number;
  confusing: number;
  informative: number;
  well_written: number;
  creative: number;
}
