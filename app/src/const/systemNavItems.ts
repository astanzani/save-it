import { IconName, NavItemKind, SystemNavItem, SystemNavItemId } from 'types';

export const AllBookmarksNavItem: SystemNavItem = {
  id: SystemNavItemId.AllBookmarks,
  kind: NavItemKind.System,
  label: 'home:navigation.menuItem.allBookmarks',
  iconName: IconName.BOOKMARKS,
};

export const TrashNavItem: SystemNavItem = {
  id: SystemNavItemId.Trash,
  kind: NavItemKind.System,
  label: 'home:navigation.menuItem.trash',
  iconName: IconName.DELETE,
};
