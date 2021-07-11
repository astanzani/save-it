import { makeStyles } from '@material-ui/core';

const DRAWER_WIDTH = 240;

export default makeStyles((theme) => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  drawerListItemIcon: {
    paddingRight: theme.spacing(1),
    minWidth: 'unset',
  },
  userInfoAvatar: {
    width: 24,
    height: 24,
    fontSize: '.75rem',
    // marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  userInfoAddButton: {
    marginLeft: 'auto',
  },
  userInfoMenuButton: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),

    '&:hover, &:focus-visible': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  userInfoMenuItemIcon: {
    marginRight: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
