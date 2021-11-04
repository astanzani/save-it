import { NewUserInfo, User } from 'types';
import fetch from './fetch';
import { HTTPMethod } from './types';
import { ApiError } from './errors';

export enum UserApiError {
  SessionExpired = 'SessionExpired',
  WrongLoginInfo = 'WrongLoginInfo',
}

const BASE_URL = '/api/v1/users/';

export async function getCurrentUser(): Promise<User> {
  const url = BASE_URL + 'current';
  const response = await fetch(url);

  if (!response.ok) {
    const apiError: ApiError = await response.json();
    throw new Error(apiError.error);
  }

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

  if (!response.ok) {
    const apiError: ApiError = await response.json();
    throw new Error(apiError.error);
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

export async function forgotPassword(email: string) {
  const url = BASE_URL + 'forgotpassword';
  const res = await fetch(url, HTTPMethod.POST, { email });

  if (res.status === 400) {
    const err = await res.json();
    throw new Error(err.message);
  }
}

export async function resetPassword(
  email: string,
  password: string,
  token: string
) {
  const url = BASE_URL + 'resetpassword';
  const res = await fetch(url, HTTPMethod.POST, { email, password, token });

  if (res.status === 403) {
    const err = await res.json();
    throw new Error(err.message);
  }
}
