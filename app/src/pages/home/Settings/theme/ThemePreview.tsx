import React from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import classNames from 'classnames';
import { ThemeVariant } from 'types';
import useStyles from './styles';

interface Props {
  theme: ThemeVariant;
  selected?: boolean;
}

export default function ThemePreview({ theme, selected }: Props) {
  const classes = useStyles();
  const navBackground = theme === 'dark' ? '#424242' : '#FFF';
  const mainBackground = theme === 'dark' ? '#000' : '#FAFAFA';
  const avatarBackground = theme === 'dark' ? '#757575' : '#BDBDBD';
  const text = theme === 'dark' ? '#FFF' : '#000';

  const rootClasses = classNames(classes.themePreview, {
    [classes.selected]: selected,
  });

  return (
    <div className={rootClasses}>
      <div
        className={classes.themePreviewNav}
        style={{ background: navBackground }}
      >
        <Box display="flex" padding={'4px'} alignItems="center">
          <Skeleton
            height={15}
            width={15}
            variant="circle"
            animation={false}
            className={classes.themePreviewAvatar}
            style={{ background: avatarBackground }}
          />
          <Skeleton
            height={10}
            width={35}
            className={classes.themePreviewName}
            style={{ background: text }}
            animation={false}
          />
        </Box>
        <Skeleton
          height={10}
          width={40}
          className={classes.themePreviewNavRow}
          animation={false}
          style={{ background: text }}
        />
        <Skeleton
          height={10}
          width={40}
          className={classes.themePreviewNavRow}
          animation={false}
          style={{ background: text }}
        />
      </div>
      <div
        className={classes.themePreviewMain}
        style={{ background: mainBackground }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Skeleton
            height={10}
            width={40}
            className={classes.themePreviewMainTitle}
            animation={false}
            style={{ background: text }}
          />
          <Skeleton
            height={10}
            width={20}
            className={classes.themeAdd}
            animation={false}
          />
        </Box>
        <Box>
          <Skeleton
            height={8}
            width={20}
            className={classes.themePreviewItemTitle}
            animation={false}
            style={{ background: text }}
          />
          <Skeleton
            height={6}
            width={40}
            className={classes.themePreviewItemDesc}
            animation={false}
            style={{ background: text }}
          />
          <Skeleton
            height={8}
            width={50}
            className={classes.themePreviewItemTitle}
            animation={false}
            style={{ background: text }}
          />
          <Skeleton
            height={6}
            width={40}
            className={classes.themePreviewItemDesc}
            animation={false}
            style={{ background: text }}
          />
        </Box>
      </div>
    </div>
  );
}
