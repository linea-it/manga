import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    padding: '0 5%',

    // Theme spacing 8 = 64px, the size of the footer,
    // + 2 spacing = 16px, to space out a little bit more
    marginBottom: theme.spacing(10)
  },
}));

export default styles;
