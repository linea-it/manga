import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
  btn: {
    textTransform: 'none',
    padding: '1px 5px',
    width: '7em',
    minHeight: '1em',
    display: 'block',
    textAlign: 'center',
    lineHeight: '2',
    boxShadow: `0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12)`,
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  input: {
    margin: 0,
  },
  plotWrapper: {
    // display: 'block',
    // display: 'flex !important',
    // alignItems: 'center',
    // justifyContent: 'center',
    // [theme.breakpoints.down('lg')]: {
    //   overflow: 'auto',
    // },
  },
  animateEnter: {
    animation: 'fadein 1s',
    textAlign: 'center',
  },
  skeletonMargin: {
    marginTop: '0.8em',
    marginBottom: '0.8em',
  },
  cardContentTable: {
    maxHeight: 500,
    overflow: 'auto',
  },
  slider: {
    maxWidth: 'calc(100% - 130px)',
    marginLeft: 'auto',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  colorRange: {
    // maxWidth: 'calc(100% - 130px)',
  },
  playButton: {
    marginLeft: 10,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  iconError: {
    marginRight: 7,
    width: '1.2em',
    fontSize: '1rem',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
}));

export default styles;
