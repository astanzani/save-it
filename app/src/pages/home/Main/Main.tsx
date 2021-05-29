import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavItemKind, RootState } from 'types';
import BookmarksList from '../Bookmarks/BookmarksList';
import useStyles from './styles';
import { IconByName, DotSeparator } from '../../common';

export default function Main() {
  const activeItem = useSelector(
    (state: RootState) => state.navigation.activeItem
  );
  const count = useSelector(
    (state: RootState) => state.bookmarks.entries.length
  );
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      padding={2}
      overflow="hidden"
    >
      <Box
        display="flex"
        component="header"
        paddingLeft={1}
        paddingRight={1}
        alignItems="center"
      >
        {activeItem.kind === NavItemKind.System && (
          <IconByName
            className={classes.icon}
            iconName={activeItem.iconName}
            size="small"
          />
        )}
        <Typography variant="h6" component="h1">
          {activeItem.kind === NavItemKind.System
            ? t(activeItem.label)
            : activeItem.label}
        </Typography>
        <DotSeparator />
        {count}
      </Box>
      <Divider />
      <BookmarksList />
    </Box>
  );
}
