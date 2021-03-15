import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  imgContainer: (props) => ({
    position: 'relative',
    maxWidth: props.width - 87,
    margin: 'auto',
    paddingRight: 87,
  }),
  img: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
  },
  imgScale: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
}));

export default styles;
