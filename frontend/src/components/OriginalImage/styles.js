import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(2)
  },
  imgContainer: props => ({
    maxWidth: props.sectionWidth / 2,
    margin: 'auto',
  }),
  img: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
  },
}));

export default styles;
