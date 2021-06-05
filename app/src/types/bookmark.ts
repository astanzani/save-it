export type BookmarkId = string;

export interface BookmarkMetadata {
  title?: string;
  description?: string;
  image?: string;
}

export interface Bookmark {
  id: BookmarkId;
  url: string;
  metadata: BookmarkMetadata,
}

export interface NewBookmarkInfo {
  url: string;
}
