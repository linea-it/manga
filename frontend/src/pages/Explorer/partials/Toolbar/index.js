import React from 'react';
import { makeStyles } from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GetAppIcon from '@mui/icons-material/GetApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import useMediaQuery from '@mui/material/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  right: {
    flexGrow: 1,
  }
}));

export default function ExplorerToolbar({ disabled, handleBackNavigation, handleDownload, handleHeader, isGrid, handleLayout }) {
  const classes = useStyles();
  const matches = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <Toolbar>
      <Button
        variant="contained"
        color="primary"
        title="Back"
        onClick={handleBackNavigation}
        disabled={disabled}
        startIcon={<ArrowBackIosIcon />}
        sx={{ mr: 1 }}
      >{matches ? 'Back' : null }</Button>
      <Button
        variant="contained"
        color="primary"
        title="Download"
        onClick={handleDownload}
        disabled={disabled}
        startIcon={<GetAppIcon />}
        sx={{ mr: 1 }}
      >{matches ? 'Download' : null }</Button>
      <Button
        variant="contained"
        color="primary"
        title="Header"
        onClick={handleHeader}
        className={classes.margin}
        disabled={disabled}
        startIcon={<ListAltIcon />}
        sx={{ mr: 1 }}
      >{matches ? 'Header' : null }
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
