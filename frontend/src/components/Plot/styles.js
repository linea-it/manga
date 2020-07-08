import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  heatmapWrapper: {
    position: 'relative',
    paddingTop: 2,
  },
  colorRange: ({ height }) => ({
    position: 'absolute',
    right: 0,
    top: theme.spacing(8),
    maxHeight: height - 80,
  }),
}));

export default useStyles;
