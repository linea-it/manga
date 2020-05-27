import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.getContrastText(blue[800]),
    backgroundColor: blue[800],
    padding: 2,
  },
}));

export default useStyles;
