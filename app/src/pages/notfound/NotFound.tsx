import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { ReactComponent as NotFoundSVG } from 'assets/not_found.svg';

export function NotFound() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      flexDirection="column"
    >
      <NotFoundSVG height={400} />
      <Box
        padding={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h6" component="h1">
          Oops!
        </Typography>
        <Typography variant="body1" component="h1">
          We could not find what you were looking for, make sure you typed the
          address correctly.
        </Typography>
      </Box>
    </Box>
  );
}
