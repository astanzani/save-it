import React from 'react';
import { Box, Button } from '@material-ui/core';
import { SortOutlined, ViewListOutlined } from '@material-ui/icons';
import useStyles from './styles';

export default function ViewOptions() {
  const classes = useStyles();

  return (
    <Box display="flex">
      <Button startIcon={<SortOutlined />} className={classes.button}>
        Date Added
      </Button>
      <Button startIcon={<ViewListOutlined />} className={classes.button}>
        List
      </Button>
    </Box>
  );
}
