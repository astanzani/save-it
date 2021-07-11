import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Locale, Preferences, ThemeVariant } from 'types';

type State = Preferences;

const initialState: State = {
  theme: 'dark',
  language: 'en',
};

const navigation = createSlice({
  name: 'Settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeVariant>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<Locale>) {
      state.language = action.payload;
    },
  },
});

export const { reducer, actions } = navigation;
