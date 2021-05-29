import { Box } from '@material-ui/core';
import React from 'react';
import { startFeed } from 'transport';
import Navigation from './Nav';
import Main from './Main/Main';
import { getAllBookmarks } from 'store/bookmarks';
import { useDispatch } from 'react-redux';

export function Home() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    startFeed();
    dispatch(getAllBookmarks());
  }, [dispatch]);

  return (
    <Box display="flex" flex="1">
      <Navigation />
      <Main />
    </Box>
  );
}
