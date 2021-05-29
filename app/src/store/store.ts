import { configureStore } from '@reduxjs/toolkit';
import { User } from 'types';
import { getStorageItem } from 'utils';
import { reducer as userReducer } from './user';
import { reducer as bookmarksReducer } from './bookmarks';
import { reducer as navigationReducer } from './navigation';

const currentUser = getStorageItem<User>('current-user');

export const store = configureStore({
  reducer: {
    user: userReducer,
    bookmarks: bookmarksReducer,
    navigation: navigationReducer,
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
