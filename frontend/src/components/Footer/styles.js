import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    float: 'right',
    height: 64,
  },
  drawer: {
    top: 'auto',
    bottom: 0,
    backgroundColor: theme.palette.primary.light,
  },
  appBarDrawerOpen: {
    width: 'calc(100% - 240px)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarDrawerClose: {
    width: `calc(100% - ${theme.spacing(7) - 1}px)`,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  grow: {
    flexGrow: 1,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionLink: {
    color: '#d2cf00',
    textDecoration: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  logoLink: {
    lineHeight: 0,
  },
}));

export default styles;
