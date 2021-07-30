import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, getCurrentUser, logout, register } from 'transport';
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

export const signUpUser = createAsyncThunk(
  'user/signup',
  async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const { email, password, firstName, lastName } = payload;
    await register({
      email,
      password,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
    });
    const user = await getCurrentUser();
    setStorageItem('current-user', user);
    return user;
  }
);

const user = createSlice({
  name: 'User',
  initialState: { info: undefined, loading: false, error: undefined } as State,
  reducers: {},
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
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.info = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(signUpUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { reducer, actions } = user;
