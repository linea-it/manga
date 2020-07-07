import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  Link,
} from '@material-ui/core';

import { ExitToApp as ExitToAppIcon } from '@material-ui/icons';

import useStyles from './styles';
import desLogo from '../../assets/img/des-portal-logo.png';

function Header({ currentUser }) {
  const classes = useStyles();
  const [userSettingsAnchorEl, setUserSettingsAnchorEl] = useState(null);
  const handleUserOpen = (e) => setUserSettingsAnchorEl(e.currentTarget);
  const handleUserClose = () => setUserSettingsAnchorEl(null);

  return (
    <AppBar
      position="relative"
      variant="dense"
    >
      <Toolbar>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Link href="/" color="inherit" underline="none">
              <Grid container spacing={1}>
                <Grid item>
                  <img src={desLogo} alt="DES Portal Logo" />
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="h1" color="inherit">MaNGA</Typography>
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid item>
            <Button color="inherit" onClick={handleUserOpen}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Avatar className={classes.avatar} onClick={handleUserOpen}>
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography color="inherit">
                    {currentUser.username}
                  </Typography>
                </Grid>
              </Grid>
            </Button>
            <Menu
              keepMounted
              anchorEl={userSettingsAnchorEl}
              open={Boolean(userSettingsAnchorEl)}
              onClose={handleUserClose}
            >
              <MenuItem onClick={() => console.log('Logout!')}>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Logout</Typography>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

Header.defaultProps = {
  currentUser: { username: '' },
};

Header.propTypes = {
  currentUser: PropTypes.shape({
    username: PropTypes.string,
  }),
};

export default Header;