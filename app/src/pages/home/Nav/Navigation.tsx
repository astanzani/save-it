import React from 'react';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Bookmarks } from '@material-ui/icons';
import UserInfo from './UserInfo';
import useStyles from './styles';

export default function Navigation() {
  const { t } = useTranslation();
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
      <List>
        <ListItem button>
          <ListItemIcon className={classes.drawerListItemIcon}>
            <Bookmarks fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            {t('home.navigation.menuItem.allBookmarks')}
          </ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}
