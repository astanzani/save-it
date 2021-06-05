import React, { Dispatch, useState } from 'react';
import { debounce } from 'lodash';
import { InputAdornment, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { actions as bookmarkActions } from 'store/bookmarks';

function search(query: string, dispatch: Dispatch<any>) {
  dispatch(bookmarkActions.search(query));
}

const debouncedSearch = debounce(search, 300);

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setQuery(value);
    debouncedSearch(value, dispatch);
  };

  return (
    <TextField
      placeholder="Search"
      variant="outlined"
      margin="dense"
      fullWidth={true}
      onChange={handleQueryChange}
      value={query}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlined fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}
