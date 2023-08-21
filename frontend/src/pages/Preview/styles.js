import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  resizeBar: {
    backgroundColor: '#ccc',
    cursor: 'col-resize',
  },
  imageSection: {
    padding: theme.spacing(1),
    maxHeight: 'calc(100vh - 79.5px)',
    overflowY: 'auto !important',
  },
}));

export default useStyles;
