import React, { forwardRef, useState } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import General from './General';
import useStyles from './styles';

export default forwardRef((props, ref) => {
  const classes = useStyles();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTabIndex(newValue);
  };

  return (
    <Box className={classes.paper}>
      <Box display="flex" paddingTop={2}>
        <Tabs
          orientation="vertical"
          value={currentTabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          className={classes.tabs}
          classes={{ flexContainer: classes.tabs }}
        >
          <Tab label="General" />
          <Tab label="Profile" />
        </Tabs>
        {currentTabIndex === 0 && <General />}
        {currentTabIndex === 1 && <Profile />}
      </Box>
    </Box>
  );
});

function Profile() {
  return <div>Profile</div>;
}
