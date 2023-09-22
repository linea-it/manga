import React, { } from 'react';

import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import GalaxyMapCard from '../maps'
import GalaxySpectrumCard from '../Spectrum';
import GalaxyStellarCard from '../Stellar'
import GalaxyBinedCard from '../Bined'



export default function ExplorerImageLayout({
  galaxy,
}) {

  const [position, setPosition] = React.useState([])

  const onChangePosition = value => {
    setPosition(value);
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
    >
      <Grid item xs={12} md={6}>
        <GalaxyMapCard
          galaxy={galaxy}
          minHeight='40vw'
          onClick={onChangePosition}
        ></GalaxyMapCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <GalaxySpectrumCard
          galaxyId={galaxy?.id}
          position={position}
          minHeight='40vw'
        >
        </GalaxySpectrumCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <GalaxyStellarCard
          galaxyId={galaxy?.id}
          position={position}
          minHeight='20vw'
        >
        </GalaxyStellarCard>
      </Grid>
      <Grid item xs={12} md={6} pb={2}>
        <GalaxyBinedCard
          galaxyId={galaxy?.id}
          position={position}
          minHeight='20vw'
        >
        </GalaxyBinedCard>
      </Grid>
    </Grid>
  );
}
ExplorerImageLayout.defaultProps = {
  galaxy: undefined
}
ExplorerImageLayout.propTypes = {
  galaxy: PropTypes.object
};
