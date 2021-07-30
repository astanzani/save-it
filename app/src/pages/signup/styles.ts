import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(4),
  },
  formInput: {
    marginBottom: theme.spacing(3),
    width: '50%',
  },
  errorAlert: {
    marginTop: theme.spacing(4),
    visibility: 'hidden',
  },
  errorAlertVisible: {
    visibility: 'visible',
  },
  spinner: {
    color: theme.palette.common.black,
  },
  signUpLink: {
    marginRight: theme.spacing(4),
  },
  forgotPassword: {
    marginLeft: theme.spacing(4),
  },
}));
