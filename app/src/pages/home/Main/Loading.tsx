import React from 'react';
import { Box, LinearProgress } from '@material-ui/core';
import logo from 'assets/logo.png';
import useStyles from './styles';

export default function Loading() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <img src={logo} alt="Save it logo" width="192px" height="192px" />
      <LinearProgress className={classes.progressBar} />
    </Box>
  );
}
