import React, { useState } from 'react';
import { FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { Locale, RootState } from 'types';
import { actions as settingsActions } from 'store/settings';
import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';

export default function Language() {
  const classes = useStyles();
  const language = useSelector((state: RootState) => state.settings.language);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(settingsActions.setLanguage(e.target.value as Locale));
  };

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <Typography component="legend" variant="subtitle1">
        Language
      </Typography>
      <Select
        value={language}
        className={classes.select}
        variant="outlined"
        onChange={handleChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pt">Portuguese</MenuItem>
      </Select>
    </FormControl>
  );
}
