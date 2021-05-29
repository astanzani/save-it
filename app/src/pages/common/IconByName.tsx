import React from 'react';
import { BookmarksOutlined, DeleteOutline } from '@material-ui/icons';
import { IconName } from 'types';

interface Props {
  iconName: IconName;
  className?: string;
  size?: 'small' | 'large';
}

const NAME_TO_ICON_MAP = {
  [IconName.BOOKMARKS]: BookmarksOutlined,
  [IconName.DELETE]: DeleteOutline,
};

export function IconByName({ iconName, className, size }: Props) {
  const IconComponent = NAME_TO_ICON_MAP[iconName];

  return <IconComponent className={className} fontSize={size} />;
}
