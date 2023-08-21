import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControlLabel,
  Switch as MuiSwitch,
  Typography,
} from '@mui/material';
import useStyles from './styles';

function Switch({ isGrid, onChange }) {
  const classes = useStyles();

  const handleSwitchChange = () => {
    onChange((prev) => !prev);
  };

  return (
    <Grid
      container
      // spacing={2}
      // justifyContent="flex-end"
      // alignItems="center"
      // className={classes.switchContainer}
    >
      <Grid>
        <Typography variant="button" display="block" gutterBottom>Image</Typography>
      </Grid>
      <Grid>
        <FormControlLabel
          className={classes.switch}
          control={(
            <MuiSwitch
              checked={isGrid}
              onChange={handleSwitchChange}
              color="default"
            />
          )}
        />
      </Grid>
      <Grid>
        <Typography variant="button" display="block" gutterBottom>Grid</Typography>
      </Grid>
    </Grid>
  );
}

Switch.propTypes = {
  isGrid: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Switch;
