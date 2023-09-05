import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // marginTop: theme.spacing(2),
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
}));

export default styles;
