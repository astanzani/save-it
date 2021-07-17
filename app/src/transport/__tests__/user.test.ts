/* eslint-disable import/first */

// const mockSetItem = jest.fn();

jest.mock('../fetch');
jest.mock('utils/storage');

import { mocked } from 'ts-jest/utils';
import * as userTransport from '../user';
import fetch from '../fetch';
import { deleteStorageItem, setStorageItem } from 'utils';
import { NewUserInfo } from 'types';

const fetchMock = mocked(fetch, true);

describe('User Transport', () => {
  it('logs user in', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'received-auth-token',
      },
    } as any);

    await userTransport.login('email', 'password');

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/users/login', 'POST', {
      email: 'email',
      password: 'password',
    });
  });

  it('throws if wrong email / password', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await expect(userTransport.login('email', 'password')).rejects.toThrow();
  });

  // Cover else branch
  it('does not thows on other error', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await userTransport.login('email', 'password');
  });

  it('returns current user', async () => {
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        firstName: 'First',
        lastName: 'Last',
      }),
    } as any);

    const res = await userTransport.getCurrentUser();

    expect(fetchMock).toBeCalledWith('/api/v1/users/current');
    expect(res.firstName).toBe('First');
    expect(res.lastName).toBe('Last');
  });

  it('logs out current user', async () => {
    await userTransport.logout();
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/users/logout', 'POST');
  });

  it('registers an user', async () => {
    const user: NewUserInfo = {
      displayName: 'Display Name',
      email: 'email@email.com',
      firstName: 'First',
      lastName: 'Last',
      password: 'pass',
    };
    await userTransport.register(user);
    expect(fetchMock).toBeCalledWith('/api/v1/users/register', 'POST', user);
  });
});
