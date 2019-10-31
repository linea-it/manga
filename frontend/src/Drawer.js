import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import {
  BrowserRouter as Router, Route, Link, Redirect, Switch,
} from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Icon from '@material-ui/core/Icon';
import { createBrowserHistory } from 'history';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Footer from './Footer';
import Logo from './assets/img/linea.png';
import Verifier from './components/Verifier';
import VerifierGrid from './components/VerifierGrid';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
    color: '#000',
    width: `calc(100% - ${theme.spacing(7) + 1}px)`,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    color: '#fff',
  },
  hide: {
    display: 'none',
  },
  drawerList: {
    paddingTop: 0,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    background: '#454545',
    borderRight: 'none',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    background: '#454545',
    borderRight: 'none',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
  },
  drawerControlWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: 'rgb(240, 241, 244)',
  },
  bodyWrapper: {
    height: '100%',
    width: '100%',
    marginTop: '64px',
  },
  bodyWrapperOpen: {
    maxWidth: `calc(100% - ${drawerWidth}px)`,
  },
  bodyWrapperClose: {
    maxWidth: `calc(100% - ${theme.spacing(7)}px)`,
  },
  homeBtn: {
    fontSize: 18,
    fontWeight: 'bold !important',
    textAlign: 'center',
    maxWidth: '100%',
    textTransform: 'uppercase',
    display: 'block',
  },
  btnGroup: {
    textAlign: 'right',
    width: '100%',
    color: '#fff',
  },
  invisibleLink: {
    color: 'black',
    textDecoration: 'none',
    display: 'none,',
  },
  textDrawer: {
    color: 'white',
    fontWeight: 500,
  },
  ListIconDrawer: {
    minWidth: 40,
    color: 'white',
  },
  ListIconDrawerOpen: {
    minWidth: 35,
  },
  ListIconControlDrawer: {
    backgroundColor: 'rgba(255,255,255,.2)',
    padding: 7,
  },
  iconDrawer: {
    width: 'auto',
    fontSize: '1.2rem',
  },
  expandClosed: {
    width: 'auto',
    fontSize: '1.7rem',
    marginLeft: '-4px',
  },
  borderDrawer: {
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  iconHomeOpen: {
    maxWidth: 140,
    borderRadius: 140,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  iconHomeClose: {
    maxWidth: 42,
    marginLeft: -8,
    borderRadius: 42,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  logoBlock: {
    display: 'block',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function MiniDrawer() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [visualizationOpen, setVisualizationOpen] = useState(true);
  const [title, setTitle] = useState('Verifier');

  const handleDrawerClick = () => setOpen(!open);

  const handleDrawerVisualizationClick = () => setVisualizationOpen(!visualizationOpen);

  return (
    <div className={classes.root}>
      <Router history={createBrowserHistory}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <Typography variant="h6" component="h1">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          open={open}
        >
          <List className={classes.drawerList}>
            <Link to="/verifier" className={classes.invisibleLink} title="Laboratório Interinstitucional de e-Astronomia">
              <ListItem button>
                <ListItemText
                  primary={(
                    <>
                      <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.logoBlock : '')}>
                        <img src={Logo} alt="TNO" className={clsx(open ? classes.iconHomeOpen : classes.iconHomeClose)} />
                      </ListItemIcon>
                    </>
                  )}
                  className={clsx(classes.homeBtn, classes.textDrawer)}
                />
              </ListItem>
            </Link>
            <Divider className={classes.borderDrawer} />
            <ListItem button onClick={handleDrawerVisualizationClick}>
              {open ? (
                <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.ListIconDrawerOpen : '')}>
                  <Icon className={clsx(classes.iconDrawer, 'fa', 'fa-images')} />
                </ListItemIcon>
              ) : (
                <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.ListIconDrawerOpen : '')}>
                  {visualizationOpen ? (
                    <ExpandLess className={classes.expandClosed} />
                  ) : (
                    <ExpandMore className={classes.expandClosed} />
                  )}
                </ListItemIcon>
              )}
              <ListItemText
                primary="Visualization"
                className={classes.textDrawer}
              />
              {open ? (
                <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.ListIconDrawerOpen : '')}>
                  {visualizationOpen
                    ? <ExpandLess className={classes.iconDrawer} />
                    : <ExpandMore className={classes.iconDrawer} />}
                </ListItemIcon>
              ) : null}
            </ListItem>
            <Collapse in={visualizationOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link to="/verifier" className={classes.invisibleLink} title="Verifier">
                  <ListItem button className={open ? classes.nested : ''}>
                    <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.ListIconDrawerOpen : '')}>
                      <Icon className={clsx(classes.iconDrawer, 'fa', 'fa-search')} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Verifier"
                      className={classes.textDrawer}
                    />
                  </ListItem>
                </Link>
                <Link to="/verifier/grid" className={classes.invisibleLink} title="Grid">
                  <ListItem button className={open ? classes.nested : ''}>
                    <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.ListIconDrawerOpen : '')}>
                      <Icon className={clsx(classes.iconDrawer, 'fa', 'fa-th')} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Grid"
                      className={classes.textDrawer}
                    />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <Divider className={classes.borderDrawer} />
          </List>
          <div className={classes.drawerControlWrapper}>
            <IconButton
              onClick={handleDrawerClick}
              className={clsx(classes.ListIconDrawer, classes.ListIconControlDrawer)}
              title={open ? 'Close' : 'Open'}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
        </Drawer>
        <div
          className={
            clsx(
              classes.bodyWrapper, open
                ? classes.bodyWrapperOpen
                : classes.bodyWrapperClose,
            )
          }
        >
          <main className={classes.content}>
            <Switch>
              <Route exact path="/verifier" render={() => <Verifier setTitle={setTitle} />} />
              <Route exact path="/verifier/grid" render={() => <VerifierGrid setTitle={setTitle} />} />
            </Switch>
            <Redirect from="/" to="/verifier" />
          </main>
          <Footer drawerOpen={open} />
        </div>
      </Router>
    </div>
  );
}

export default MiniDrawer;
