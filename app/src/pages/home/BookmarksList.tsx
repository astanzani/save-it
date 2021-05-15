import React from 'react';
import { useSelector } from 'react-redux';
import { Box, List, ListItem } from '@material-ui/core';
import { RootState } from 'types';

export default function BookmarksList() {
  const { entries: bookmarks, loading } = useSelector(
    (state: RootState) => state.bookmarks
  );

  if (loading) {
    return null;
  }

  return (
    <Box padding={2}>
      <List>
        {bookmarks.map((bookmark) => (
          <ListItem key={bookmark.id}>{bookmark.url}</ListItem>
        ))}
      </List>
    </Box>
  );
}
