import { createMuiTheme } from '@material-ui/core';

export const baseTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#00BFA6',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 32,
      },
    },
  },
});
