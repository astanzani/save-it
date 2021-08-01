import React from 'react';
import { Box, InputAdornment, TextField, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { LockOpen } from '@material-ui/icons';

import * as validators from 'utils/validators';
import { LoadingButton } from 'components';
import { resetPassword } from 'transport/user';
import { useQueryParams } from 'hooks/useQueryParams';
import useStyles from './styles';

interface FormData {
  password: string;
}

interface FormDataErrors {
  password?: string;
}

export function ResetPassword() {
  const { t } = useTranslation();
  const params = useQueryParams();
  const classes = useStyles();

  const validate = (values: FormData) => {
    let errors: FormDataErrors = {};

    if (!validators.isStrongPassword(values.password)) {
      errors.password = t('resetpassword:form.error.password');
    }

    return errors;
  };

  const submit = async (values: FormData) => {
    const email = params.get('email')!;
    const token = params.get('token')!;

    await resetPassword(email, values.password, token);
  };

  return (
    <Box display="flex" flex="1">
      <Formik
        initialValues={{ password: '' }}
        validate={validate}
        onSubmit={submit}
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
              {t('resetpassword:title')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className={classes.title}
              color="textSecondary"
            ></Typography>
            <TextField
              id="password"
              name="password"
              className={classes.formInput}
              variant="outlined"
              label={
                errors.password && touched.password
                  ? errors.password
                  : t('resetpassword:form.password')
              }
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
              placeholder={t('resetpassword:form.password')}
              error={!!errors.password && touched.password}
            />
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid}
              type="submit"
              // loading={loading}
            >
              {t('resetpassword:send')}
            </LoadingButton>
          </Box>
        )}
      </Formik>
    </Box>
  );
}
