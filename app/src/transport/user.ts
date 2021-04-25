import { NewUserInfo, User } from 'types';
import fetch from './fetch';
import { HTTPMethod } from './types';

const BASE_URL = '/api/v1/users/';

export async function getCurrentUser(): Promise<User> {
  // TODO throw if !resp.ok
  const url = BASE_URL + 'current';
  const response = await fetch(url);
  const user = await response.json();
  return user as User;
}

export async function login(email: string, password: string) {
  const url = BASE_URL + 'login';
  const payload = {
    email,
    password,
  };
  const response = await fetch(url, HTTPMethod.POST, payload);

  if (response.status === 401) {
    throw new Error('Wrong Email or Password');
  }
}

export async function logout() {
  const url = BASE_URL + 'logout';
  await fetch(url, HTTPMethod.POST);
}

export async function register(userInfo: NewUserInfo) {
  const url = BASE_URL + 'register';
  return fetch(url, HTTPMethod.POST, userInfo);
}
