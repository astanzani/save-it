import { NewUserInfo, User } from 'types';
import { setStorageItem, deleteStorageItem } from 'utils';
import { UnauthorizedError } from './errors';
import fetch from './fetch';
import { HTTPMethod } from './types';

const BASE_URL = '/api/v1/users/';

export async function getCurrentUser(): Promise<User> {
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
  const response = await fetch(url, HTTPMethod.POST, payload, false);

  if (response.ok) {
    const authToken = response.headers.get('x-auth-token');
    setStorageItem('x-auth-token', authToken);
    return;
  }

  if (response.status === 401) {
    throw new UnauthorizedError('Wrong Email or Password');
  }
}

export async function logout() {
  deleteStorageItem('x-auth-token');
}

export async function register(userInfo: NewUserInfo) {
  const url = BASE_URL + 'register';
  return fetch(url, HTTPMethod.POST, userInfo, false);
}
