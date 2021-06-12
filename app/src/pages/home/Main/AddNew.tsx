import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Popover,
  TextField,
} from '@material-ui/core';
import { Bookmark } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBookmark } from 'store/bookmarks';
import { usePrevious } from 'hooks/usePrevious';
import { RootState, StateStatus } from 'types';
import useStyles from './styles';

const INITIAL_STATE = 'https://';

export default function AddNew() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [url, setUrl] = useState(INITIAL_STATE);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const creating = useSelector(
    (state: RootState) => state.bookmarks.status === StateStatus.Creating
  );
  const classes = useStyles();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setUrl(INITIAL_STATE);
    setAnchorEl(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createBookmark({ url }));
  };

  const prevCreating = usePrevious(creating);
  useEffect(() => {
    if (prevCreating && !creating) {
      setUrl(INITIAL_STATE);
      handleClose();
    }
  }, [creating, prevCreating]);

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
              placeholder="https://google.com"
              margin="dense"
              fullWidth={true}
              value={url}
              onChange={handleInputChange}
            />
            <div className={classes.saveButtonWrapper}>
              <Button
                className={classes.popoverSubmitButton}
                variant="contained"
                color="primary"
                disabled={creating}
                onClick={onSave}
              >
                {t('home.list.addNew.save')}
              </Button>
              {creating && (
                <CircularProgress size={24} className={classes.saveProgress} />
              )}
            </div>
          </form>
        </Paper>
      </Popover>
    </Box>
  );
}
