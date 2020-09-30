import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Dialog,
  IconButton,
  Grid,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

function MegacubeHeader({ data, open, setOpen }) {

  return (
    <Dialog
      onClose={setOpen}
      aria-labelledby="megacube-header"
      open={open}
    >
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Megacube Header"
              action={(
                <IconButton aria-label="close" onClick={setOpen}>
                <CloseIcon />
              </IconButton>
              )}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {data.map(row => (
                    <Typography key={row} paragraph>{row}</Typography>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Dialog>
  );
}


MegacubeHeader.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};


export default MegacubeHeader;
