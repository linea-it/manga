import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
  formControl: {
    width: '180px',
    position: 'absolute',
    top: '8px',
    left: '24px',
    zIndex: '999',
  },
  noDataCell: {
    padding: '48px 0px',
  },
  noDataWrapper: {
    left: '50%',
    display: 'inline-block',
    position: 'sticky',
  },
  noDataText: {
    display: 'inline-block',
    transform: 'translateX(-50%)',
  },
  gridContainer: {
    maxHeight: 200,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'end',
    '& button:nth-child(1)': {
      order: 2,
    },
    '& div:nth-child(2)': {
      display: 'none',
    },
    '& div:nth-child(3)': {
      order: 1,
    },
    '& button:nth-child(4)': {
      order: 3,
    },
  },
  filterButton: {
    margin: `0 ${theme.spacing(1)}px`,
  },
  addFilter: {
    padding: 0,
    width: '100%',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  firstTableCell: {
    padding: '6px 24px 6px 6px',
  },
}));

export default useStyles;
