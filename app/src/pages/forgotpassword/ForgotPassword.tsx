import React, { useEffect, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { AlternateEmailOutlined } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { Alert } from '@material-ui/lab';
import classNames from 'classnames';

import * as validators from 'utils/validators';
import { LoadingButton } from 'components';
import { forgotPassword } from 'store/user';
import { useCurrentUser, usePrevious } from 'hooks';
import useStyles from './styles';

interface FormData {
  email: string;
}

interface FormDataErrors {
  email?: string;
}

export function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [, loading, error] = useCurrentUser();
  const [emailSent, setEmailSent] = useState(false);
  const classes = useStyles();

  const alertClassName = classNames(classes.errorAlert, {
    [classes.errorAlertVisible]: !!error || emailSent,
  });

  const prevLoading = usePrevious(loading);
  useEffect(() => {
    if (prevLoading && !loading && !error) {
      setEmailSent(true);
    }
  }, [loading, prevLoading, error]);

  const validate = (values: FormData) => {
    let errors: FormDataErrors = {};

    if (!validators.isEmail(values.email)) {
      errors.email = t('forgotpassword:form.error.email');
    }

    return errors;
  };

  return (
    <Box display="flex" flex="1">
      <Formik
        initialValues={{ email: '' }}
        validate={validate}
        onSubmit={(values) => {
          dispatch(forgotPassword(values.email));
        }}
        validateOnBlur={true}
        validateOnMount={true}
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
              {t('forgotpassword:title')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className={classes.title}
              color="textSecondary"
            >
              {t('forgotpassword:description')}
            </Typography>
            {!emailSent && (
              <>
                <TextField
                  id="email"
                  name="email"
                  className={classes.formInput}
                  variant="outlined"
                  label={
                    errors.email && touched.email
                      ? errors.email
                      : t('forgotpassword:form.email')
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
                  placeholder={t('forgotpassword:form.email')}
                  error={!!errors.email && touched.email}
                />
                <LoadingButton
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!isValid}
                  type="submit"
                  loading={loading}
                >
                  {t('forgotpassword:send')}
                </LoadingButton>
              </>
            )}
            <Alert
              variant="outlined"
              severity={error ? 'error' : 'success'}
              className={alertClassName}
            >
              {error
                ? error
                : emailSent
                ? t('forgotpassword:alert.emailSent')
                : null}
            </Alert>
          </Box>
        )}
      </Formik>
    </Box>
  );
}
