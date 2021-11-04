import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types';

type State = User | null;

const user = createSlice({
  name: 'User',
  initialState: null as State,
  reducers: {
    setUser(state, action: PayloadAction<State>) {
      state = action.payload;
      return state;
    },
  },
});

export const { reducer, actions } = user;
