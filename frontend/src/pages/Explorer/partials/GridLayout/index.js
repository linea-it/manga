import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({}));

export default function ExplorerGridLayout({ 
  galaxy, 
}) {
  const classes = useStyles();
  return (
    <div>Grid Layout</div>
    // <Grid
    //   container
    //   direction="row"
    //   justifyContent="space-between"
    //   alignItems="stretch"
    //   spacing={2}
    // >
    //   <Grid item xs={6}>
    //     <GalaxyMapCard
    //       galaxyId={galaxy?.id}
    //       galaxyPlateifu={galaxy?.plateifu}
    //       minHeight='40vw'
    //     ></GalaxyMapCard>
    //   </Grid>
    //   <Grid item xs={6}>
    //     <GalaxySpectrumCard
    //       galaxyId={galaxy?.id}
    //       position={[49, 43]}
    //       minHeight='40vw'
    //     >
    //     </GalaxySpectrumCard>
    //   </Grid>
    // </Grid>
  );
}
ExplorerGridLayout.defaultProps = {
  galaxy: undefined
}
ExplorerGridLayout.propTypes = {
  galaxy: PropTypes.object
};

