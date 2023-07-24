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
import filesize from 'filesize';
import Link from '@material-ui/core/Link';
import useStyles from './styles';

function MegacubeDownload({ data, setOpen }) {

  const classes = useStyles();

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
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
        {data.bcomp_name && (
            <Typography>Broad component: {data.bcomp_name}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={setOpen}>
          Cancel
        </Button>
        {data.link_bcomp && (
          <Button variant="contained" color="primary" href={data.link_bcomp} onClick={setOpen}>
          Download Broad component
          </Button>
        )}
        <Button variant="contained" color="primary" href={data.link} onClick={setOpen}>
          Download
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
