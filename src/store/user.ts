import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, getCurrentUser, logout } from 'transport';
import { User } from 'types';
import { deleteStorageItem, setStorageItem } from 'utils';

type State = {
  info: User | undefined;
  loading: boolean;
  error: string | undefined;
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (payload: { email: string; password: string }) => {
    await login(payload.email, payload.password);
    const user = await getCurrentUser();
    setStorageItem('current-user', user);
    return user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  deleteStorageItem('current-user');
  return logout();
});

const user = createSlice({
  name: 'User',
  initialState: { info: undefined, loading: false, error: undefined } as State,
  reducers: {
    logout: (state, action: PayloadAction<void>) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.info = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.info = undefined;
    });
  },
});

export const { reducer, actions } = user;
