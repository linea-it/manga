import React, { useState, useEffect } from 'react';

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
import { loggedUser, logout } from '../../services/auth';

import useStyles from './styles';
import logo from '../../assets/img/logo.png';
import { loggedUser, logout } from '../../services/auth';
import TutorialDialog from './TutorialDialog';

function Header() {
  const classes = useStyles();
  const [userSettingsAnchorEl, setUserSettingsAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState({ username: '' });

  const handleUserOpen = (e) => setUserSettingsAnchorEl(e.currentTarget);
  const handleUserClose = () => setUserSettingsAnchorEl(null);

  useEffect(() => {
    loggedUser().then((res) => {
      if (res) {
        setUsername(res.username);
      }
    });
  }, []);

  return (
    <AppBar position="relative">
      <Toolbar variant="dense">
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Link href="/" color="inherit" underline="none">
              <Grid container spacing={1}>
                <Grid item>
                  <img src={desLogo} alt="DES Portal Logo" />
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="h1" color="inherit">
                    MaNGA
                  </Typography>
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
              <MenuItem onClick={logout}>
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

export default Header;
