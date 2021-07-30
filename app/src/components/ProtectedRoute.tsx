import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { Routes } from 'const';
import { useAuth } from 'hooks';

interface Props extends RouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children, ...rest }) => {
  const isAuthenticated = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        return isAuthenticated ? children : <Redirect to={Routes.SIGN_IN} />;
      }}
    />
  );
};
