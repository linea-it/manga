import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#24292e'
  },
  media: {
    height: '',
    width: '',
  },
  grow: {
    flexGrow: 1,
  },
  username: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  menuIcon: {
    marginRight: theme.spacing(1),
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  closeIcon: {
    fontSize: '1rem',
  },
  playerWrapper: {
    position: 'relative',
  },
  blockWrapper: {
    marginBottom: theme.spacing(4),
  },
  contentWrapper: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
