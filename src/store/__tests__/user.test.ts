/* eslint-disable import/first */

jest.mock('../../transport/user');
jest.mock('../../utils/storage');

import { ThunkDispatch } from '@reduxjs/toolkit';
import { mocked } from 'ts-jest/utils';
import { RootState, store } from '../store';
import * as user from '../../transport/user';
import * as storage from '../../utils/storage';
import * as userSlice from '../user';

const mockUser = mocked(user, true);
const mockStorage = mocked(storage, true);

describe('User Slice', () => {
  describe('Actions', () => {
    let dispatch: ThunkDispatch<any, any, any>;
    let getState: () => RootState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it('logs user in', async () => {
      mockUser.getCurrentUser.mockResolvedValueOnce({
        displayName: 'Display Name',
      } as any);

      const action = userSlice.loginUser({ email: 'email', password: 'pass' });
      await action(dispatch, getState, undefined);

      expect(mockUser.login).toBeCalledWith('email', 'pass');
      expect(mockStorage.setStorageItem).toBeCalledWith('current-user', {
        displayName: 'Display Name',
      });
    });

    it('logs user out', async () => {
      const action = userSlice.logoutUser();
      await action(dispatch, getState, undefined);

      expect(mockStorage.deleteStorageItem).toBeCalledWith('current-user');
    });
  });

  describe('Reducers', () => {
    beforeEach(() => {
      // Clear store state
      store.dispatch({
        type: 'user/login/fulfilled',
        payload: undefined,
      });
    });

    it('has default state', () => {
      const state = store.getState();

      expect(state.user).toEqual({
        info: undefined,
        loading: false,
        error: undefined,
      });
    });

    it('logs user in', () => {
      store.dispatch({
        type: 'user/login/fulfilled',
        payload: {
          displayName: 'Display Name',
        },
      });

      const state = store.getState();
      expect(state.user).toEqual({
        info: {
          displayName: 'Display Name',
        },
        error: undefined,
        loading: false,
      });
    });

    it('sets loading to true while logging user in', () => {
      store.dispatch({
        type: 'user/login/pending',
      });
      const state = store.getState();
      expect(state.user).toEqual({
        info: undefined,
        error: undefined,
        loading: true,
      });
    });

    it('sets error message if cannot log user in', () => {
      store.dispatch({
        type: 'user/login/rejected',
        error: {
          message: 'Some Error Message',
        },
      });
      const state = store.getState();
      expect(state.user).toEqual({
        info: undefined,
        error: 'Some Error Message',
        loading: false,
      });
    });

    it('logs user out', () => {
      store.dispatch({
        type: 'user/login/fulfilled',
        payload: {
          displayName: 'Display Name',
        },
      });

      store.dispatch({
        type: 'user/logout/fulfilled',
      });

      const state = store.getState();
      expect(state.user).toEqual({
        info: undefined,
        error: undefined,
        loading: false,
      });
    });
  });
});
