import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from 'store';
import { startFeed } from 'transport';

export function Home() {
  React.useEffect(() => {
    // startFeed();
  }, []);

  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logoutUser());
  };

  return <Button onClick={onClickLogout}>Logout</Button>;
}
