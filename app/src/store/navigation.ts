import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllBookmarksNavItem } from 'const';
import { NavItem } from 'types';

interface State {
  activeItem: NavItem;
}

const initialState: State = {
  activeItem: AllBookmarksNavItem,
};

const navigation = createSlice({
  name: 'Navigation',
  initialState,
  reducers: {
    setActive(state, action: PayloadAction<NavItem>) {
      state.activeItem = action.payload;
    },
  },
});

export const { reducer, actions } = navigation;
