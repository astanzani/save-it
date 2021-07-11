import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: '1px',
    flex: 1,

    '&:hover': {
      background: theme.palette.action.hover,
    },

    '&:focus-within': {
      background: theme.palette.action.hover,
    },
  },
  cardRoot: {
    display: 'flex',
    flex: '1',
    cursor: 'pointer',
    padding: theme.spacing(2),
    position: 'relative',

    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  cardImageContainer: {
    display: 'flex',
    flexShrink: 0,
    width: 100,
    height: 100,
    marginRight: theme.spacing(1),
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  textEllipsis: {
    // whiteSpace: 'nowrap',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  urlEllipsis: {
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    maxWidth: '50%',
    wordBreak: 'break-all',
  },
  cardLink: {
    color: 'inherit',
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'none',
    },

    '&:focus': {
      outline: 'none',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  },
  secondaryText: {
    color: theme.palette.text.secondary,
  },
}));
