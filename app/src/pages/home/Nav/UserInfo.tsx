import React, { useState } from 'react';
import {
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import {
  AccountCircleOutlined,
  Add,
  ArrowDropDown,
  ExitToAppOutlined,
  SettingsOutlined,
  WebOutlined,
} from '@material-ui/icons';
import { useCurrentUser } from 'hooks';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { logoutUser } from 'store';

export default function UserInfo() {
  const [userInfo] = useCurrentUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const classes = useStyles();

  if (!userInfo) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogout = () => {
    dispatch(logoutUser());
  };

  const initials = userInfo.firstName[0] + userInfo.lastName[0];

  return (
    <Box display="flex" alignItems="center" padding={1}>
      <ButtonBase
        className={classes.userInfoMenuButton}
        onClick={handleClick}
        aria-controls="user-info-menu"
      >
        <Avatar className={classes.userInfoAvatar}>{initials}</Avatar>
        <Typography variant="body2">{userInfo.displayName}</Typography>
        <ArrowDropDown />
      </ButtonBase>
      <Menu
        id="user-info-menu"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        getContentAnchorEl={null}
      >
        <MenuItem>
          <AccountCircleOutlined
            className={classes.userInfoMenuItemIcon}
            fontSize="small"
          />
          {t('home.navigation.userInfo.menuItem.profile')}
        </MenuItem>
        <MenuItem>
          <SettingsOutlined
            className={classes.userInfoMenuItemIcon}
            fontSize="small"
          />
          {t('home.navigation.userInfo.menuItem.settings')}
        </MenuItem>
        <MenuItem>
          <WebOutlined
            className={classes.userInfoMenuItemIcon}
            fontSize="small"
          />
          {t('home.navigation.userInfo.menuItem.browserExtension')}
        </MenuItem>
        <MenuItem onClick={onClickLogout}>
          <ExitToAppOutlined
            className={classes.userInfoMenuItemIcon}
            fontSize="small"
          />
          {t('home.navigation.userInfo.menuItem.signOut')}
        </MenuItem>
      </Menu>
      <IconButton className={classes.userInfoAddButton} size="small">
        <Add />
      </IconButton>
    </Box>
  );
}
