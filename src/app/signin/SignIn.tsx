import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AlternateEmailOutlined, LockOpen } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { login, UnauthorizedError } from 'transport';
import { ReactComponent as SignInSVG } from 'assets/sign_in.svg';
import { Routes } from 'const';
import { useAuth } from 'hooks';
import useStyles from './styles';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuth();
  const classes = useStyles();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onClickLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      await login(email, password);
    } catch (e) {
      setLoading(false);
      if (e instanceof UnauthorizedError) {
        setError('Wrong email or password.');
      } else {
        setError('An unknown error occured. Please try again later.');
      }
    }
  };

  const alertClassName = classNames(classes.errorAlert, {
    [classes.errorAlertVisible]: !!error,
  });

  if (isAuthenticated) {
    return <Redirect to={Routes.HOME} />;
  }

  return (
    <Box display="flex" flex="1">
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex="1"
      >
        <Typography variant="h4" component="h1" className={classes.title}>
          Welcome to Save It!
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className={classes.title}
          color="textSecondary"
        >
          Sign in to continue
        </Typography>
        <TextField
          id="email"
          className={classes.formInput}
          variant="outlined"
          label="Email"
          type="email"
          onChange={onChangeEmail}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
          placeholder="your_email@email.com"
        />
        <TextField
          id="password"
          className={classes.formInput}
          variant="outlined"
          label="Password"
          type="password"
          onChange={onChangePassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOpen fontSize="small" />
              </InputAdornment>
            ),
          }}
          placeholder="*******"
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onClickLogin}
        >
          {loading ? (
            <CircularProgress
              color="secondary"
              size={32}
              className={classes.spinner}
            />
          ) : (
            'Sign In'
          )}
        </Button>
        <Alert variant="outlined" severity="error" className={alertClassName}>
          {error}
        </Alert>
      </Box>
      <Box display="flex" alignItems="center" flex="1">
        <SignInSVG />
      </Box>
    </Box>
  );
}
