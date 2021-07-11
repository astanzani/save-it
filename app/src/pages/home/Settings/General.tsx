import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import classNames from 'classnames';
import ThemeSettings from './theme/Theme';
import LanguageSettings from './language/Language';
import useStyles from './styles';

export default function General() {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column">
      <ThemeSettings />
      <LanguageSettings />
    </Box>
  );
}
