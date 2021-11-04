import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';

interface Props extends ButtonProps {
  loading?: boolean;
}

export function LoadingButton({ children, loading, ...props }: Props) {
  const classes = useStyles();

  return (
    <Button {...props}>
      {loading ? (
        <CircularProgress
          color="secondary"
          size={32}
          className={classes.spinner}
        />
      ) : (
        children
      )}
    </Button>
  );
}

const useStyles = makeStyles((theme) => ({
  spinner: {
    color: theme.palette.common.black,
  },
}));
