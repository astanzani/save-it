import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  button: {
    borderRadius: theme.shape.borderRadius,
    textTransform: 'capitalize',

    '&:first-child': {
      marginRight: theme.spacing(1),
    },
  },
}));
