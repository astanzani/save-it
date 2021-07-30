import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core';
import { baseTheme, darkTheme } from '../themes';
import { ProtectedRoute } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from 'types';

const Home = lazy(() => import('./home'));
const SignUp = lazy(() => import('./signup'));
const SignIn = lazy(() => import('./signin'));

export default function App() {
  const { i18n } = useTranslation();
  const theme = useSelector((state: RootState) => state.settings.theme);
  const language = useSelector((state: RootState) => state.settings.language);
  // const { language } = i18n;

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [i18n, language]);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : baseTheme}>
      <Router>
        <CssBaseline />
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <ProtectedRoute exact path="/">
              <Home />
            </ProtectedRoute>
          </Switch>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}
