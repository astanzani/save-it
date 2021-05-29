import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    scrollBar: {
      main: React.CSSProperties['color'];
      hover: React.CSSProperties['color'];
    };
  }
  interface ThemeOptions {
    scrollBar: {
      main: React.CSSProperties['color'];
      hover: React.CSSProperties['color'];
    };
  }
}

export const baseTheme = createMuiTheme({
  scrollBar: {
    main: '#D6DEE1',
    hover: '#A8BBBF',
  },
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
