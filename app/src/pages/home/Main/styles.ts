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
  addPopover: {
    padding: theme.spacing(2),
    width: 500,
  },
  popoverSubmitButton: {
    position: 'relative',
    display: 'block',
    marginLeft: 'auto',
    marginTop: theme.spacing(2),
  },
  saveButtonWrapper: {
    position: 'relative',
    display: 'flex',
    width: 'fit-content',
    'margin-left': 'auto',
  },
  saveProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -4,
    marginLeft: -12,
  },
}));
