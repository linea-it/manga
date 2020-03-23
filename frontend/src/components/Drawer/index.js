import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Drawer as MuiDrawer,
  AppBar,
  Typography,
  List,
  CssBaseline,
  Divider,
  Icon,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,

  Collapse,
} from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import styles from './styles';
import logo from '../../assets/img/linea.png';
import Footer from '../Footer';

function Drawer({ title, children }) {
  const [open, setOpen] = useState(false);
  const [visualizationOpen, setVisualizationOpen] = useState(true);

  const handleDrawerClick = () => setOpen(!open);

  const handleDrawerVisualizationClick = () => setVisualizationOpen(!visualizationOpen);

  const classes = styles({ open });

  return (
    <div>
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
      <MuiDrawer
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
          <Link to="/" className={classes.invisibleLink} title="Laboratório Interinstitucional de e-Astronomia">
            <ListItem button>
              <ListItemText
                primary={(
                  <>
                    <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.logoBlock : '')}>
                      <img src={logo} alt="TNO" className={clsx(open ? classes.iconHomeOpen : classes.iconHomeClose)} />
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
              <Link to="/" className={classes.invisibleLink} title="Galaxies">
                <ListItem button className={open ? classes.nested : ''}>
                  <ListItemIcon className={clsx(classes.ListIconDrawer, open ? classes.ListIconDrawerOpen : '')}>
                    <Icon className={clsx(classes.iconDrawer, 'fa', 'fa-search')} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Galaxies"
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
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
      </MuiDrawer>
      <main className={clsx(classes.childrenContainer, open ? classes.appBarDrawerOpen : classes.appBarDrawerClose)}>
        {children}
      </main>
      <Footer open={open} />
    </div>
  );
}

Drawer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  title: PropTypes.string.isRequired,
};

export default Drawer;
