import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './styles';
import filesize from 'filesize';

function MegacubeDownload({ data, setOpen }) {

  const classes = useStyles();

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="download-megacube"
      open={data.open}
    >
      <DialogTitle>
        <Typography variant="h6">Download Megacube</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={setOpen}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography>MaNGA ID: {data.mangaid}</Typography>
        <Typography>Name: {data.name}</Typography>
        <Typography>File: {data.megacube}</Typography>
        <Typography>Size: {filesize(data.size)}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={setOpen}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" href={data.link} onClick={setOpen}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
    );
}


MegacubeDownload.propTypes = {
  data: PropTypes.shape({
    open: PropTypes.bool,
    mangaid: PropTypes.string,
    name: PropTypes.string,
    megacube: PropTypes.string,
    link: PropTypes.string,
    size: PropTypes.number,
  }).isRequired,
  setOpen: PropTypes.func.isRequired,
};


export default MegacubeDownload;
