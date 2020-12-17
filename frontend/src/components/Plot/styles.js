import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  heatmapWrapper: {
    position: 'relative',
    paddingTop: 2,
  },
  colorRange: ({ height }) => ({
    position: 'absolute',
    right: -16,
    top: theme.spacing(2),
    maxHeight: height - 18,
  }),
  vecWrapper: {
    position: 'relative',
  },
  vecTooltipWrapper: {
    position: 'absolute',
    right: 0,
    top: 20,
    zIndex: 2,
  },
}));

export default useStyles;
