import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Divider,
} from '@material-ui/core';

import {
  Home as HomeIcon,
  Menu as MenuIcon,
  Help as HelpIcon,
  HelpOutline as HelpOutlineIcon,
  ExitToApp as LogoutIcon,
} from '@material-ui/icons';

import useStyles from './styles';
import logo from '../../assets/img/logo.png';
import { loggedUser, logout } from '../../services/auth';
import TutorialDialog from './TutorialDialog';

function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [username, setUsername] = useState('');

  const tutorials = [
    {
      id: 1,
      title: 'Overview',
      description: 'A walkthrough of all the features of the application',
      videoId: 'nuPe8Ouo2oA',
    },
  ];

  useEffect(() => {
    loggedUser().then((res) => {
      if (res) {
        setUsername(res.username);
      }
    });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAbout = () => {
    handleClose();
    window.open('http://www.linea.gov.br');
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleHome = () => {
    const { protocol } = window.location;
    const { host } = window.location;
    const location = `${protocol}//${host}/`;

    window.location.assign(location);
  };

  const handleTutorials = () => {
    setTutorialOpen(true);
  };

  const handleHelp = () => {
    const { protocol } = window.location;
    const { host } = window.location;
    const location = `${protocol}//${host}/contact-us/`;

    handleClose();

    window.open(location);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={handleHome}>
            <img alt="LIneA Dark Logo" src={logo} />
          </IconButton>
          <Typography className={classes.grow} variant="h6" color="inherit">
            MaNGA
          </Typography>

          <Typography
            variant="subtitle1"
            color="inherit"
            className={classes.username}
          >
            {username}
          </Typography>
          <IconButton
            color="inherit"
            // className={classes.menuButton}
            onClick={handleHome}
          >
            <HomeIcon />
          </IconButton>

          <IconButton
            className={classes.menuButton}
            onClick={handleClick}
            color="inherit"
            disableRipple
            disableFocusRipple
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleAbout}>About LIneA</MenuItem>
            <MenuItem onClick={handleTutorials}>
              <HelpIcon className={classes.menuIcon} fontSize="small" />
              <Typography>Tutorials</Typography>
            </MenuItem>
            <MenuItem onClick={handleHelp}>
              <HelpOutlineIcon className={classes.menuIcon} fontSize="small" />
              <Typography>Help</Typography>
            </MenuItem>

            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon className={classes.menuIcon} fontSize="small" />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <TutorialDialog
        open={tutorialOpen}
        setClose={() => setTutorialOpen(false)}
        data={tutorials}
      />
    </>
  );
}

export default Header;
