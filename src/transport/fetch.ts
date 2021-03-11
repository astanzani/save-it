/* eslint-disable import/no-anonymous-default-export */
import { HTTPMethod } from './types';
import { getStorageItem } from 'utils';

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

  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQzN2ZlMzEzMjFiZWE3MTQ2ZjcwZWEiLCJpYXQiOjE2MTUwNTU0MTR9.aa83BuC61WQb9InzPNu-XDEmw0JFuGTY_iJ768mIAg8

  const init: RequestInit = {
    method,
    body: payload,
    headers,
  };

  return fetch(url, init);
}
