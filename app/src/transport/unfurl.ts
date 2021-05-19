import { LinkUnfurled } from 'types';
import fetch from './fetch';

const BASE_URL = '/api/v1/unfurl';

export async function unfurlLink(url: string) {
  const apiUrl = `${BASE_URL}?url=${url}`;
  const res = await fetch(apiUrl);
  const linkUnfurled = await res.json();
  return linkUnfurled as LinkUnfurled;
}
