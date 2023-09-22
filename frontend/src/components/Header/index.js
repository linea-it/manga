import React, { useState } from 'react';
import {
  IconButton,
  Typography,
  MenuItem,
  Menu,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import useStyles from './styles';
import logo from '../../assets/img/logo.png';
import { APP_VERSION } from '../../services/api';

function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAbout = () => {
    handleClose();
    window.open('http://www.linea.org.br');
  };

  const handleHome = () => {
    // TODO: Utilizar React Router DOM
    const { protocol } = window.location;
    const { host } = window.location;
    const location = `${protocol}//${host}/`;

    window.location.assign(location);
  };

  const handleTutorials = () => {
    // TODO: Utilizar React Router DOM
    const { protocol } = window.location;
    const { host } = window.location;
    const location = `${protocol}//${host}/tutorials/`;

    handleClose();

    window.open(location);
  };

  const handleHelp = () => {
    // TODO: Utilizar React Router DOM
    const { protocol } = window.location;
    const { host } = window.location;
    const location = `${protocol}//${host}/contact-us/`;

    handleClose();

    window.open(location);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#24292e" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleHome}>
            <img alt="LIneA Dark Logo" src={logo} />
          </IconButton>
          <Typography variant="h6" color="inherit">
            MaNGA
          </Typography>
          {APP_VERSION !== undefined && (
            <Typography
              variant="body"
              // pt={1}
              pl={2}
              sx={{
                // color: "yellow",
                fontSize: "0.75em",
                flexGrow: 1,
              }}
              >
              v{APP_VERSION}
            </Typography>
          )}
          <IconButton
            color="inherit"
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
              <Typography>Tutorials</Typography>
            </MenuItem>
            <MenuItem onClick={handleHelp}>
              <Typography>Help</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
