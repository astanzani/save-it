import React from 'react';
import { Box } from '@material-ui/core';
import ThemeSettings from './theme/Theme';
import LanguageSettings from './language/Language';

export default function General() {
  return (
    <Box display="flex" flexDirection="column">
      <ThemeSettings />
      <LanguageSettings />
    </Box>
  );
}
