import React from 'react';
import {
  Box,
  Link as MuiLink,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AlternateEmailOutlined, LockOpen } from '@material-ui/icons';
import { Redirect, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Formik } from 'formik';

import { ReactComponent as SignInSVG } from 'assets/sign_in.svg';
import { Routes } from 'const';
import { loginUser } from 'store';
import { useAuth, useCurrentUser } from 'hooks';
import { LoadingButton } from 'components';
import useStyles from './styles';

interface FormData {
  email: string;
  password: string;
}

interface FormDataErrors {
  email?: string;
  password?: string;
}

export function SignIn() {
  const dispatch = useDispatch();
  const [, loading, error] = useCurrentUser();
  const isAuthenticated = useAuth();
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const alertClassName = classNames(classes.errorAlert, {
    [classes.errorAlertVisible]: !!error,
  });

  console.log(i18n);

  if (isAuthenticated) {
    return <Redirect to={Routes.HOME} />;
  }

  const validate = (values: FormData) => {
    let errors: FormDataErrors = {};

    if (values.email.trim() === '') {
      errors.email = t('signin:form.error.email');
    }
    if (values.password.trim() === '') {
      errors.password = t('signin:form.error.password');
    }

    return errors;
  };

  return (
    <Box display="flex" flex="1">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
          dispatch(
            loginUser({ email: values.email, password: values.password })
          );
        }}
        validateOnMount={true}
        validateOnBlur={true}
        validate={validate}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          errors,
          touched,
        }) => (
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
              {t('signin:welcome')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className={classes.title}
              color="textSecondary"
            >
              {t('signin:signInToContinue')}
            </Typography>
            <TextField
              id="email"
              name="email"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.email && touched.email
                  ? errors.email
                  : t('signin:form.email')
              }
              error={!!errors.email && touched.email}
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder={t('signin:form.email')}
            />
            <TextField
              id="password"
              name="password"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.password && touched.password
                  ? errors.password
                  : t('signin:form.password')
              }
              error={!!errors.password && touched.password}
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder={t('signin:form.password')}
            />
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid}
              type="submit"
              loading={loading}
            >
              {t('signin:form.signIn')}
            </LoadingButton>
            <Box display="flex" padding={4}>
              <Link
                to={Routes.SIGN_UP}
                component={MuiLink}
                className={classes.signUpLink}
              >
                {t('signin:form.createAccount')}
              </Link>
              <Link
                to={Routes.FORGOT_PASSWORD}
                component={MuiLink}
                className={classes.forgotPassword}
              >
                {t('signin:form.forgotPassword')}
              </Link>
            </Box>
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
        <SignInSVG title={''} width="100%" height="100%" />
      </Box>
    </Box>
  );
}
