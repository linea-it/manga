import { makeStyles } from '@mui/styles';

const styles = makeStyles(() => ({
  initContainer: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  root: {
    paddingTop: 25,
  },
  item: {
    cursor: 'pointer',
    maxHeight: 460,
    overflow: 'overlay',
    borderRight: 'solid 1px #cccccc',
    borderBottom: 'solid 1px #cccccc',
    backgroundColor: '#f5f5f5',
    '&:hover': {
      background: '#efefef',
    },
  },
  codeBlock: {
    padding: 15,
    borderRadius: '2px',
    background: '#efefef',
  },
}));

export default styles;
