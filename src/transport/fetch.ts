/* eslint-disable import/no-anonymous-default-export */
import { HTTPMethod } from './types';
import { getStorageItem } from 'utils';

const BASE_PROD_URL = 'https://save-it-be.herokuapp.com';

export default async function (
  url: string,
  method: HTTPMethod = HTTPMethod.GET,
  data?: object,
  withCredentials = true
) {
  let payload: string | undefined;
  if (data) {
    payload = JSON.stringify(data);
  }
  const headers = new Headers();
  const authToken = getStorageItem<string>('x-auth-token');

  if (withCredentials && authToken) {
    headers.set('Authorization', authToken);
  }

  headers.set('Content-Type', 'application/json');

  const init: RequestInit = {
    method,
    body: payload,
    headers,
  };

  let finalUrl = url;

  if (process.env.NODE_ENV === 'production') {
    finalUrl = BASE_PROD_URL + url;
  }

  return fetch(finalUrl, init);
}
