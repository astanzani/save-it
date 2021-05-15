import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookmarks } from 'transport';

import { Bookmark } from 'types';

type State = {
  entries: Bookmark[];
  loading: boolean;
  error: string | undefined;
};

export const getAllBookmarks = createAsyncThunk(
  'bookmarks/getAll',
  async () => {
    return getBookmarks();
  }
);

const bookmarks = createSlice({
  name: 'Bookmarks',
  initialState: { entries: [], loading: false, error: undefined } as State,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBookmarks.fulfilled, (state, action) => {
      state.entries = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(getAllBookmarks.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllBookmarks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { reducer, actions } = bookmarks;
