import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { startFeed } from 'transport';
import Navigation from './Nav';
import Main from './Main/Main';
import { getAllBookmarks } from 'store/bookmarks';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from 'store';

export function Home() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.settings.language);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [i18n, language]);

  useEffect(() => {
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
