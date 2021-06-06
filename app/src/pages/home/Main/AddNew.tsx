import React, { useState } from 'react';
import { Box, Button, Paper, Popover, TextField } from '@material-ui/core';
import { Bookmark } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

export default function AddNew() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const classes = useStyles();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={handleClick}
        variant="outlined"
        color="primary"
        startIcon={<Bookmark />}
        aria-controls="add-menu"
      >
        {t('home.list.fab')}
      </Button>
      <Popover
        id="add-menu"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        getContentAnchorEl={null}
      >
        <Paper className={classes.addPopover}>
          <form noValidate={true}>
            <TextField
              label="URL"
              variant="outlined"
              autoFocus={true}
              defaultValue="https://"
              placeholder="https://google.com"
              margin="dense"
              fullWidth={true}
            />
            <Button
              className={classes.popoverSubmitButton}
              variant="contained"
              color="primary"
            >
              {t('home.list.addNew.save')}
            </Button>
          </form>
        </Paper>
      </Popover>
    </Box>
  );
}
