import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '20px',
    },
    '*::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: theme.scrollBar.main,
      borderRadius: '20px',
      border: '6px solid transparent',
      backgroundClip: 'content-box',
    },
    '*::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.scrollBar.hover,
    },
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  progressBar: {
    height: 6,
    width: 300,
    marginTop: theme.spacing(2),
  },
}));
