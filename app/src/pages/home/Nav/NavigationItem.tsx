import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { actions as navActions } from 'store/navigation';
import { NavItem, NavItemKind } from 'types';
import useStyles from './styles';
import { IconByName } from 'pages/common';
import { useTranslation } from 'react-i18next';

interface Props {
  item: NavItem;
  selected: boolean;
}

export default function NavigationItem({ item, selected }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const onClickNavItem = (item: NavItem) => {
    dispatch(navActions.setActive(item));
  };

  return (
    <ListItem
      button
      selected={selected}
      onClick={onClickNavItem.bind(null, item)}
    >
      {item.kind === NavItemKind.System && (
        <ListItemIcon className={classes.drawerListItemIcon}>
          <IconByName iconName={item.iconName} size="small" />
        </ListItemIcon>
      )}
      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
        {item.kind === NavItemKind.System ? t(item.label) : item.label}
      </ListItemText>
    </ListItem>
  );
}
