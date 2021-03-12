import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SignIn } from './signin';
import { Home } from './home';
import { ProtectedRoute } from './common';

export default function App() {
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
