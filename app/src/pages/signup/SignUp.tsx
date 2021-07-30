import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link as MuiLink,
} from '@material-ui/core';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  AlternateEmailOutlined,
  LockOpen,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { useDispatch } from 'react-redux';

import { useAuth, useCurrentUser } from 'hooks';
import { Routes } from 'const';
import { LoadingButton } from 'components';
import * as validators from 'utils/validators';
import { signUpUser } from 'store';
import { ReactComponent as SignUpSVG } from 'assets/sign_up.svg';
import useStyles from './styles';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FormDataErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export const SignUp = () => {
  const isAuthenticated = useAuth();
  const { t } = useTranslation();
  const [, loading] = useCurrentUser();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  if (isAuthenticated) {
    return <Redirect to={Routes.HOME} />;
  }

  const validate = (values: FormData) => {
    let errors: FormDataErrors = {};

    if (!validators.isEmail(values.email)) {
      errors.email = t('signUp.form.error.email');
    }
    if (!validators.isStrongPassword(values.password)) {
      errors.password = t('signUp.form.error.password');
    }
    if (!validators.isName(values.firstName)) {
      errors.firstName = t('signUp.form.error.firstName');
    }
    if (!validators.isName(values.lastName)) {
      errors.lastName = t('signUp.form.error.lastName');
    }

    return errors;
  };

  const handleShowPasswordClick = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box display="flex" flex="1">
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        validateOnMount={true}
        validateOnBlur={true}
        validate={validate}
        onSubmit={(values) => {
          const { email, password, firstName, lastName } = values;
          dispatch(signUpUser({ email, password, firstName, lastName }));
        }}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          isValid,
          errors,
          touched,
        }) => (
          <Box
            component="form"
            flex="1"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Typography variant="h4" component="h1" className={classes.title}>
              {t('signUp.welcome')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className={classes.title}
              color="textSecondary"
            >
              {t('signUp.createAnAccount')}
            </Typography>
            <TextField
              id="first-name"
              name="firstName"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.firstName && touched.firstName
                  ? errors.firstName
                  : t('signUp.form.firstName')
              }
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder={t('signUp.form.firstName')}
              error={!!errors.firstName && !!touched.firstName}
            />
            <TextField
              id="last-name"
              name="lastName"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.lastName && touched.lastName
                  ? errors.lastName
                  : t('signUp.form.lastName')
              }
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder={t('signUp.form.lastName')}
              error={!!errors.lastName && !!touched.lastName}
            />
            <TextField
              id="email"
              name="email"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.email && touched.email
                  ? errors.email
                  : t('signIn.form.email')
              }
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
              placeholder={t('signIn.form.email')}
              error={!!errors.email && touched.email}
            />
            <TextField
              id="password"
              name="password"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.password && touched.password
                  ? errors.password
                  : t('signIn.form.password')
              }
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPasswordClick}>
                      {showPassword ? (
                        <VisibilityOff fontSize="small" color="primary" />
                      ) : (
                        <Visibility fontSize="small" color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder={t('signIn.form.password')}
              error={!!errors.password && touched.password}
              helperText={t('signUp.form.helperText.password')}
            />
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid}
              type="submit"
              loading={loading}
            >
              {t('signUp.form.signUp')}
            </LoadingButton>
            <Box display="flex" padding={4}>
              <Link to={Routes.SIGN_IN} component={MuiLink}>
                Sign In instead
              </Link>
            </Box>
          </Box>
        )}
      </Formik>
      <Box display="flex" alignItems="center" flex="1">
        <SignUpSVG title={''} width="100%" height="100%" />
      </Box>
    </Box>
  );
};
