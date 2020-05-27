import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  resizeBar: {
    backgroundColor: '#ccc',
    cursor: 'col-resize',
  },
  imageSection: {
    padding: theme.spacing(1),
  },
  container: {
    minHeight: '100%',
  },
}));

export default useStyles;
