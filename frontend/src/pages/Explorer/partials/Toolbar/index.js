import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({}));

export default function ExplorerToolbar({ handleBackNavigation, handleDownload, handleHeader }) {
  const classes = useStyles();

  return (
    <Toolbar>
      <Button
        variant="contained"
        color="primary"
        title="Back"
        onClick={handleBackNavigation}
      >
        <Icon className="fas fa-undo" fontSize="inherit" />
        <Typography variant="button" style={{ margin: '0 5px' }}>
          Back
        </Typography>
      </Button>
      <Button
        variant="contained"
        color="primary"
        title="Download"
        onClick={handleDownload}
      >
        <Icon className="fas fa-download" fontSize="inherit" />
        <Typography variant="button" style={{ margin: '0 5px' }}>
          Download
        </Typography>
      </Button>
      <Button
        variant="contained"
        color="primary"
        title="Header"
        onClick={handleHeader}
      >
        <Icon className="fas fa-table" fontSize="inherit" />
        <Typography variant="button" style={{ margin: '0 5px' }}>
          Header
        </Typography>
      </Button>
    </Toolbar>
  );
}

ExplorerToolbar.propTypes = {
  handleBackNavigation: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  handleHeader: PropTypes.func.isRequired,
};