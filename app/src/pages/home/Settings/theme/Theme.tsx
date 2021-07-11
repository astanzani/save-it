import React, { useState } from 'react';
import { FormControl, Typography, RadioGroup } from '@material-ui/core';
import { RootState, ThemeVariant } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { actions as settingsActions } from 'store/settings';
import ThemePreviewRadio from './ThemePreviewRadio';
import useStyles from './styles';

export default function Theme() {
  const classes = useStyles();
  // const [theme, setTheme] = useState<ThemeVariant>('dark');
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.settings.theme);

  const handleChange = (theme: ThemeVariant) => {
    dispatch(settingsActions.setTheme(theme));
  };

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <Typography component="legend" variant="subtitle1">
        Theme
      </Typography>
      <RadioGroup className={classes.radioGroup}>
        <ThemePreviewRadio
          theme="light"
          onChange={handleChange}
          selected={theme === 'light'}
        />
        <ThemePreviewRadio
          theme="dark"
          onChange={handleChange}
          selected={theme === 'dark'}
        />
      </RadioGroup>
    </FormControl>
  );
}
