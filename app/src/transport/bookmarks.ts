import { Bookmark, NewBookmarkInfo } from 'types';
import fetch from './fetch';
import { HTTPMethod } from './types';
import { ConflictError } from './errors';

const BASE_URL = '/api/v1/bookmarks';

export async function getBookmarks() {
  const response = await fetch(BASE_URL);
  const bookmarks = await response.json();
  return bookmarks as Bookmark[];
}

export async function addBookmark(bookmark: NewBookmarkInfo) {
  const response = await fetch(BASE_URL, HTTPMethod.POST, bookmark);
  const created = await response.json();
  return created as Bookmark;
}
