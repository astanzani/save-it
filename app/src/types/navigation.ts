export type NavItemId = string;

export enum NavItemKind {
  System = 'System',
  Tag = 'Tag',
}

export enum SystemNavItemId {
  AllBookmarks = 'AllBookmarks',
  Trash = 'Trash',
}

export enum IconName {
  BOOKMARKS = 'bookmarks',
  DELETE = 'delete',
}

export interface SystemNavItem {
  kind: NavItemKind.System;
  id: SystemNavItemId;
  label: string;
  iconName: IconName;
}

export interface TagNavItem {
  kind: NavItemKind.Tag;
  id: string;
  label: string;
}

export type NavItem = SystemNavItem | TagNavItem;
