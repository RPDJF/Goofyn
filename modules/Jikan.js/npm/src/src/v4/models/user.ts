export interface UserImages {
  jpg?: {
    image_url?: string;
  };
  webp?: {
    image_url?: string;
  };
}

export interface UserMeta {
  username: string;
  url: string;
  images: UserImages;
}
