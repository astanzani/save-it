import React, { useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { LockOpen, VisibilityOff, Visibility } from '@material-ui/icons';

export function PasswordInput({ ...props }: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      id="password"
      name="password"
      variant="outlined"
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOpen fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <VisibilityOff fontSize="small" color="primary" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
