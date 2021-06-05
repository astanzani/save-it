import React from 'react';
import { Box, List, ListItem, Typography } from '@material-ui/core';
import { Bookmark } from 'types';
import BookmarkPreview from './BookmarkPreview';
import { ReactComponent as EmptySVG } from 'assets/empty.svg';
import useStyles from './styles';

interface Props {
  bookmarks: Bookmark[];
  query: string;
}

export default function BookmarksList({ bookmarks, query }: Props) {
  const classes = useStyles();

  return (
    <Box display="flex" flex="1" overflow="auto" className={classes.root}>
      {bookmarks.length === 0 ? (
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <EmptySVG title={''} width={192} height={192} />
          <Typography variant="h5" component="h3">
            Nothing to show
          </Typography>
          <Typography variant="body1">
            Try adding bookmarks or using a different search term
          </Typography>
        </Box>
      ) : (
        <List className={classes.list}>
          {bookmarks.map((bookmark) => (
            <ListItem
              className={classes.listItem}
              disableGutters
              key={bookmark.id}
            >
              <BookmarkPreview bookmark={bookmark} query={query} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
