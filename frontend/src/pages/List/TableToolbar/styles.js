import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  addButton: {
    color: '#9cc96b',
    marginLeft: theme.spacing(2),
  },
  deleteButton: {
    color: '#e13345',
    margin: `0 ${theme.spacing(1)}px`,
  },
}));

export default useStyles;
