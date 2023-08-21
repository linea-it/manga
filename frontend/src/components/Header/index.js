import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Divider,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  Help as HelpIcon,
  HelpOutline as HelpOutlineIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

import useStyles from './styles';
import logo from '../../assets/img/logo.png';
import { loggedUser, logout, urlLogin, urlLogout } from '../../services/auth';
import TutorialDialog from './TutorialDialog';

function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(undefined);
  // const [usernameAnchorEl, setUsernameAnchorEl] = useState(null);

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
      if (res === null) {
        setIsAuthenticated(false)
        // setUser(undefined)
      }
      if (res) {
        // setUser(res)
        setIsAuthenticated(true)
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
    window.open('http://www.linea.org.br');
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

  // const handleUsernameClick = (event) => {
  //   setUsernameAnchorEl(event.currentTarget);
  // };

  // const handleUsernameClose = () => {
  //   setUsernameAnchorEl(null);
  // };

  // const usernameOpen = Boolean(usernameAnchorEl);

  // function UserLogged() {
  //   return (
  //     <>
  //       <Button color="inherit" onClick={handleUsernameClick}>
  //         {user.username || ''}
  //       </Button>
  //       <Popover
  //         id="simple-popover"
  //         anchorEl={usernameAnchorEl}
  //         open={usernameOpen}
  //         onClose={handleUsernameClose}
  //         PaperProps={{
  //           style: {
  //             transform: 'translateX(calc(100vw - 185px)) translateY(45px)',
  //           },
  //         }}
  //       >
  //         <List className={classes.list}>
  //           <ListItem button>
  //             <Button
  //               href={urlLogout}
  //               color="inherit"
  //               startIcon={<ExitToAppIcon />}
  //             >
  //               Logout
  //             </Button>
  //           </ListItem>
  //         </List>
  //       </Popover>
  //     </>
  //   );
  // }
  // function UserUnLogged() {
  //   return (
  //     <>
  //       <Button href={urlLogin} color="inherit">
  //         Sign in
  //       </Button>
  //     </>
  //   );
  // }


  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleHome}>
            <img alt="LIneA Dark Logo" src={logo} />
          </IconButton>
          <Typography className={classes.grow} variant="h6" color="inherit">
            MaNGA
          </Typography>

          {/* {user && user.username ? <UserLogged /> : <UserUnLogged />} */}

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
            {isAuthenticated === true && (
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon className={classes.menuIcon} fontSize="small" />
                  <Typography>Logout</Typography>
                </MenuItem>
            )}
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
