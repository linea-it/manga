import { makeStyles } from '@mui/styles';

const styles = makeStyles({
  titleItem: {
    fontFamily: 'Oxanium',
    fontSize: '2em',
    paddingTop: '0.5em',
    paddingLeft: '0.5em',
    color: 'white',
    textShadow: '0.1em 0.1em 0.1em black',
  },
  media: {
    minHeight: 220,
    width: '100%',
    height: '100%',
  },
  icon: {
    maxWidth: 50,
  },
  card: {
    position: 'relative',
    height: 'auto',
  },
  cardAction: {
    display: 'contents',
  },
  grid: {
    margin: 'auto',
  },
  minHeight: {
    minHeight: 265,
  },
});

export default styles;
