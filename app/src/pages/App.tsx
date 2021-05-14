import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SignIn } from './signin';
import { Home } from './home';
import { ProtectedRoute } from './common';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { i18n } = useTranslation();
  const { language } = i18n;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <SignIn />
        </Route>
        <ProtectedRoute exact path="/">
          <Home />
        </ProtectedRoute>
      </Switch>
    </Router>
  );
}
