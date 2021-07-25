/* eslint-disable import/no-anonymous-default-export */
import { HTTPMethod } from './types';

export default async function (
  url: string,
  method: HTTPMethod = HTTPMethod.GET,
  data?: object
) {
  let payload: string | undefined;
  if (data) {
    payload = JSON.stringify(data);
  }
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const init: RequestInit = {
    method,
    body: payload,
    headers,
    credentials: 'include',
  };

  return fetch(url, init);
}
