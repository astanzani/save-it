import { configureStore } from '@reduxjs/toolkit';
import { User } from 'types';
import { getStorageItem } from 'utils';
import { reducer as userReducer } from './user';

const currentUser = getStorageItem<User>('current-user');

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: {
      info: currentUser,
      loading: false,
      error: undefined,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
