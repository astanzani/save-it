import { NewBookmarkInfo } from 'types';

export function parseBookmarksFromString(html: string): NewBookmarkInfo[] {
  const el = document.createElement('html');
  el.innerHTML = html;

  const anchors = Array.from(el.querySelectorAll('a'));

  return anchors.map((anchor) => ({
    url: anchor.href,
  }));
}
