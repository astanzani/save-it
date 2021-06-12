import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { addBookmark, getBookmarks } from 'transport';

import { Bookmark, NewBookmarkInfo, StateStatus } from 'types';

type State = {
  entries: Bookmark[];
  status: StateStatus;
  error: SerializedError | undefined;
  query: string;
};

export const getAllBookmarks = createAsyncThunk(
  'bookmarks/getAll',
  async () => {
    return getBookmarks();
  }
);

export const createBookmark = createAsyncThunk(
  'bookmarks/add',
  async (bookmark: NewBookmarkInfo) => {
    return addBookmark(bookmark);
  }
);

const bookmarks = createSlice({
  name: 'Bookmarks',
  initialState: {
    entries: [],
    status: StateStatus.Idle,
    error: undefined,
    query: '',
  } as State,
  reducers: {
    search(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllBookmarks.fulfilled, (state, action) => {
      state.entries = action.payload;
      state.status = StateStatus.Idle;
      state.error = undefined;
    });
    builder.addCase(getAllBookmarks.pending, (state, action) => {
      state.status = StateStatus.Fetching;
    });
    builder.addCase(getAllBookmarks.rejected, (state, action) => {
      state.status = StateStatus.Idle;
      state.error = action.error;
    });
    builder.addCase(createBookmark.fulfilled, (state, action) => {
      state.entries.push(action.payload);
      state.status = StateStatus.Idle;
    });
    builder.addCase(createBookmark.pending, (state, action) => {
      state.status = StateStatus.Creating;
    });
    builder.addCase(createBookmark.rejected, (state, action) => {
      state.error = action.error;
      state.status = StateStatus.Idle;
    });
  },
});

export const { reducer, actions } = bookmarks;
