import React from 'react';
import { Box, Radio, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { ThemeVariant } from 'types';
import ThemePreview from './ThemePreview';
import useStyles from './styles';

interface Props {
  theme: ThemeVariant;
  selected: boolean;
  onChange: (theme: ThemeVariant) => void;
}

export default function ThemePreviewRadio({
  theme,
  selected,
  onChange,
}: Props) {
  const classes = useStyles();

  const handleChange = () => {
    onChange(theme);
  };

  return (
    <Box
      className={classNames(classes.radio, {
        [classes.radioSelected]: selected,
      })}
    >
      <label className={classes.label}>
        <ThemePreview theme={theme} selected={selected} />
        <Box
          display="flex"
          alignItems="center"
          className={classNames(classes.inputWrapper, {
            [classes.inputWrapperSelected]: selected,
          })}
        >
          <Radio
            onChange={handleChange}
            value={theme}
            checked={selected}
            size="small"
            color="primary"
          />
          <Typography variant="body2" className={classes.themeName}>
            {theme}
          </Typography>
        </Box>
      </label>
    </Box>
  );
}
