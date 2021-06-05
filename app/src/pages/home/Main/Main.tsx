import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Bookmark, NavItemKind, RootState } from 'types';
import BookmarksList from '../Bookmarks/BookmarksList';
import Search from '../Search/Search';
import ViewOptions from '../ViewOptions/ViewOptions';
import { IconByName, DotSeparator } from '../../common';
import Loading from './Loading';
import useStyles from './styles';

export default function Main() {
  const activeItem = useSelector(
    (state: RootState) => state.navigation.activeItem
  );
  const {
    entries: bookmarks,
    loading,
    query,
  } = useSelector((state: RootState) => state.bookmarks);
  const { t } = useTranslation();
  const classes = useStyles();

  const filteredBookmarks = filterByQuery(bookmarks, query);

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
          {query
            ? 'Search Results'
            : activeItem.kind === NavItemKind.System
            ? t(activeItem.label)
            : activeItem.label}
        </Typography>
        <DotSeparator />
        {filteredBookmarks.length}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={1}
      >
        <Box flex="1">
          <Search />
        </Box>
        <Box flex="2" display="flex" justifyContent="flex-end">
          <ViewOptions />
        </Box>
      </Box>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <BookmarksList bookmarks={filteredBookmarks} query={query} />
      )}
    </Box>
  );
}

function filterByQuery(bookmarks: Bookmark[], query: string): Bookmark[] {
  return bookmarks.filter((bookmark) => {
    const { metadata, url } = bookmark;
    const matchTitle = metadata.title ? match(query, metadata.title) : false;
    const matchDescription = metadata.description
      ? match(query, metadata.description)
      : false;
    const matchUrl = match(query, url);

    return matchTitle || matchDescription || matchUrl;
  });
}

function match(query: string, text: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}