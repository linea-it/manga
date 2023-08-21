import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    // color: theme.palette.grey[500],
  },
}));

export default useStyles;
