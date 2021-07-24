import React from 'react';
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
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ReactComponent as SignInSVG } from 'assets/sign_in.svg';
import { Routes } from 'const';
import { loginUser } from 'store';
import { useAuth, useCurrentUser } from 'hooks';
import useStyles from './styles';

const signInSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

export function SignIn() {
  const dispatch = useDispatch();
  const [, loading, error] = useCurrentUser();
  const isAuthenticated = useAuth();
  const { t } = useTranslation();
  const classes = useStyles();

  const alertClassName = classNames(classes.errorAlert, {
    [classes.errorAlertVisible]: !!error,
  });

  if (isAuthenticated) {
    return <Redirect to={Routes.HOME} />;
  }

  return (
    <Box display="flex" flex="1">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={signInSchema}
        onSubmit={(values) => {
          dispatch(
            loginUser({ email: values.email, password: values.password })
          );
        }}
        validateOnMount
      >
        {({ handleChange, handleSubmit, isValid }) => (
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flex="1"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Typography variant="h4" component="h1" className={classes.title}>
              {t('signIn.welcome')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className={classes.title}
              color="textSecondary"
            >
              {t('signIn.signInToContinue')}
            </Typography>
            <TextField
              id="email"
              name="email"
              className={classes.formInput}
              variant="outlined"
              label={t('signIn.form.email')}
              type="email"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder={t('signIn.form.email')}
            />
            <TextField
              id="password"
              name="password"
              className={classes.formInput}
              variant="outlined"
              label={t('signIn.form.password')}
              type="password"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder={t('signIn.form.password')}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid}
              type="submit"
            >
              {loading ? (
                <CircularProgress
                  color="secondary"
                  size={32}
                  className={classes.spinner}
                />
              ) : (
                t('signIn.form.signIn')
              )}
            </Button>
            <Alert
              variant="outlined"
              severity="error"
              className={alertClassName}
            >
              {error}
            </Alert>
          </Box>
        )}
      </Formik>
      <Box display="flex" alignItems="center" flex="1">
        <SignInSVG title={''} />
      </Box>
    </Box>
  );
}
