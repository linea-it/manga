import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
// import Popover from '@mui/material/Popover';
import { useLocation } from 'react-router-dom';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import Avatar from '@mui/material/Avatar';
// import { loggedUser, urlLogin, urlLogout } from '../../../services/auth';
// import styles from './styles';


function Header() {
  const location = useLocation();
  const trigger = useScrollTrigger({
    threshold: 10,
    disableHysteresis: true,
  });
  // const classes = styles({
  //   scrollActive: trigger,
  //   pathname: location.pathname,
  // });

  // const [user, setUser] = useState(undefined);

  // useEffect(() => {
  //   loggedUser().then((result) => setUser(result));
  // }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const open = Boolean(anchorEl);

  // function UserLogged() {
  //   return (
  //     <>
  //       <Button color="inherit" onClick={handleClick}>
  //         <Avatar className={classes.avatar}>
  //           {user.username.substr(0, 1) || ''}
  //         </Avatar>
  //         {user.username || ''}
  //       </Button>
  //       <Popover
  //         id="simple-popover"
  //         anchorEl={anchorEl}
  //         open={open}
  //         onClose={handleClose}
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
  //       {/* <Button color="inherit">Sign up</Button> */}
  //     </>
  //   );
  // }

  const menus = [
    {
      description: 'Home',
      href: '/',
      target: '_self',
    },
    {
      description: 'About',
      href: '/about-us',
      target: '_self',
    },
    {
      description: 'Tutorials',
      href: '/tutorials',
      target: '_self',
    },
    {
      description: 'Contact',
      href: '/contact-us',
      target: '_self',
    },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: "#24292e" }}>
      <Toolbar>
        <img
          src={`${process.env.PUBLIC_URL}/img/linea-dark-invert.png`}
          alt="LIneA"
          width={75}
        />
          {menus.map((menu) => (
            <Button
              key={`menu_item_${menu.description}`}
              color="inherit"
              href={menu.href}
              >{menu.description}
            </Button>
          ))}
        {/* <div className={classes.separator} /> */}
        {/* {user && user.username ? <UserLogged /> : <UserUnLogged />} */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
