import React from 'react';
import { useSelector } from 'react-redux';
import { Box, List, ListItem } from '@material-ui/core';
import { RootState } from 'types';
import BookmarkPreview from './BookmarkPreview';
import useStyles from './styles';

export default function BookmarksList() {
  const { entries: bookmarks, loading } = useSelector(
    (state: RootState) => state.bookmarks
  );
  const classes = useStyles();

  if (loading || bookmarks.length <= 0) {
    return null;
  }

  return (
    <Box display="flex" flex="1" padding={2} className={classes.root}>
      <List className={classes.list}>
        {bookmarks.map((bookmark) => (
          <ListItem
            className={classes.listItem}
            disableGutters
            key={bookmark.id}
          >
            <BookmarkPreview url={bookmark.url} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
