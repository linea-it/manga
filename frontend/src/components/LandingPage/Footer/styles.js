import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    // position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: '#212121',
  },
  container: {
    maxWidth: '100%',
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
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  poweredBy: {
    display: 'inline-block',
    verticalAlign: 'middle',
    color: '#fff',
  },
  logoFooter: {
    cursor: 'pointer',
    marginLeft: '10px',
    maxWidth: '75px',
  },
  marginItem: {
    padding: '5px 20px',
  },
}));

export default useStyles;
