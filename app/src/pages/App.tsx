import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core';

import { baseTheme, darkTheme } from '../themes';
import { ProtectedRoute } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from 'types';
import { Routes } from 'const';

const Home = lazy(() => import('./home'));
const SignUp = lazy(() => import('./signup'));
const SignIn = lazy(() => import('./signin'));
const NotFound = lazy(() => import('./notfound'));
const ForgotPassword = lazy(() => import('./forgotpassword'));
const ResetPassword = lazy(() => import('./resetpassword'));

export default function App() {
  const theme = useSelector((state: RootState) => state.settings.theme);

  const { i18n } = useTranslation();

  console.log(i18n.language);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : baseTheme}>
      <Router>
        <CssBaseline />
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route path={Routes.SIGN_IN}>
              <SignIn />
            </Route>
            <Route path={Routes.SIGN_UP}>
              <SignUp />
            </Route>
            <Route path={Routes.FORGOT_PASSWORD}>
              <ForgotPassword />
            </Route>
            <Route path={Routes.RESET_PASSWORD}>
              <ResetPassword />
            </Route>
            <ProtectedRoute exact path="/">
              <Home />
            </ProtectedRoute>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}
