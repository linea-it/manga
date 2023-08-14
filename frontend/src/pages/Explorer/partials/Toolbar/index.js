import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginRight: theme.spacing(1),
  },
  right: {
    flexGrow: 1,
  }
}));

export default function ExplorerToolbar({ disabled, handleBackNavigation, handleDownload, handleHeader, isGrid, handleLayout }) {
  const classes = useStyles();

  return (
    <Toolbar>
      <Button
        variant="contained"
        color="primary"
        title="Back"
        onClick={handleBackNavigation}
        className={classes.margin}
        disabled={disabled}
        startIcon={<ArrowBackIosIcon />}
      >Back</Button>
      <Button
        variant="contained"
        color="primary"
        title="Download"
        onClick={handleDownload}
        className={classes.margin}
        disabled={disabled}
        startIcon={<GetAppIcon />}
      >Download</Button>
      <Button
        variant="contained"
        color="primary"
        title="Header"
        onClick={handleHeader}
        className={classes.margin}
        disabled={disabled}
        startIcon={<ListAltIcon />}
      >Header
      </Button>

      <div className={classes.right} />
      {/* Switch Layout */}
      <Typography variant="button" color="inherit">
        Image
      </Typography>
      <Switch 
        checked={isGrid} 
        onChange={handleLayout} 
        disabled={disabled}
        color="primary"
        ></Switch>
      <Typography variant="button" color="inherit">
        Grid
      </Typography>
    </Toolbar>
  );
}
ExplorerToolbar.defaultProps = {
  disabled: false,
  isGrid: false
}
ExplorerToolbar.propTypes = {
  disabled: PropTypes.bool,
  handleBackNavigation: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  handleHeader: PropTypes.func.isRequired,
  handleLayout: PropTypes.func.isRequired,
  isGrid: PropTypes.bool.isRequired
};