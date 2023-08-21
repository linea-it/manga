import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  DialogTitle,
  Dialog,
  Grid,
  DialogContent,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import YouTube from 'react-youtube';
import useStyles from './styles';

function TutorialDialog({ open, setClose, data }) {
  const classes = useStyles();

  return (
    <Dialog
      onClose={setClose}
      open={open}
      fullWidth
      maxWidth="md"
      style={{ zIndex: 9999 }}
    >
      <DialogContent dividers>
        <DialogTitle>Tutorial</DialogTitle>
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={setClose}
        >
          <CloseIcon className={classes.closeIcon} />
        </IconButton>
        <Divider />
        <Grid container spacing={3} className={classes.contentWrapper}>
          {data.map((row) => (
            <Fragment key={row.id}>
              <Grid item xs={12}>
                <div className={classes.blockWrapper}>
                  <Typography variant="h6" component="h2">
                    {row.title}
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {row.description}
                  </Typography>
                  <div className={classes.playerWrapper}>
                    <YouTube
                      videoId={row.videoId}
                      opts={{ width: '100%' }}
                      controls
                    />
                  </div>
                </div>
                <Divider />
              </Grid>
            </Fragment>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

TutorialDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setClose: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TutorialDialog;
