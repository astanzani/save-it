import React from 'react';
import { FiberManualRecord } from '@material-ui/icons';
import { Box } from '@material-ui/core';

export function DotSeparator() {
  return (
    <Box
      component="span"
      display="flex"
      alignItems="center"
      fontSize=".5rem"
      marginLeft={1}
      marginRight={1}
    >
      <FiberManualRecord fontSize="inherit" color="inherit" />
    </Box>
  );
}
