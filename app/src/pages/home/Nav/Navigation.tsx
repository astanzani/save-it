import React from 'react';
import { Divider, Drawer, List } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { NavItem, RootState } from 'types';
import { AllBookmarksNavItem, TrashNavItem } from 'const';
import UserInfo from './UserInfo';
import NavigationItem from './NavigationItem';
import useStyles from './styles';

const SYSTEM_NAV_ITEMS = [AllBookmarksNavItem, TrashNavItem];

export default function Navigation() {
  const activeItem = useSelector(
    (state: RootState) => state.navigation.activeItem
  );
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <UserInfo />
      <Divider />
      <List>{renderSystemNavItems(activeItem)}</List>
    </Drawer>
  );
}

function renderSystemNavItems(activeItem: NavItem) {
  return SYSTEM_NAV_ITEMS.map((item) => (
    <NavigationItem
      key={item.id}
      item={item}
      selected={activeItem.id === item.id}
    />
  ));
}
