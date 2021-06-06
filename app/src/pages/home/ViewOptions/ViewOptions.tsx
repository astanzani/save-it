import React from 'react';
import { Box, Button } from '@material-ui/core';
import { SortOutlined, ViewListOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

export default function ViewOptions() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box display="flex">
      <Button startIcon={<SortOutlined />} className={classes.button}>
        {t('home.list.sort.dropdown.dateAdded')}
      </Button>
      <Button startIcon={<ViewListOutlined />} className={classes.button}>
        {t('home.list.viewOptions.dropdown.list')}
      </Button>
    </Box>
  );
}
