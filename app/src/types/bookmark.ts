export type BookmarkId = string;

export interface Bookmark {
  id: BookmarkId;
  url: string;
}

export interface NewBookmarkInfo {
  url: string;
}
