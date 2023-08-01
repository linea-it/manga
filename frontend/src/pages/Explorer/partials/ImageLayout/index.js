import React, { } from 'react';
import { useQuery } from 'react-query'
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import GalaxyMapCard from '../maps'
import GalaxySpectrumCard from '../Spectrum';
import GalaxyStellarCard from '../Stellar'
import GalaxyBinedCard from '../Bined'
import GenericError from '../../../../components/Alerts/GenericError';
import { getHdus } from '../../../../services/api';

export default function ExplorerImageLayout({
  galaxy,
}) {

  const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  const { data: hdus, isLoading } = useQuery({
    queryKey: ['HdusByGalaxyId', { id: galaxy.id }],
    queryFn: getHdus,
    keepPreviousData: true,
    refetchInterval: false,
    retry: 1,
    staleTime: 1 * 60 * 60 * 1000,
    onError: () => { setErrorIsOpen(true) }
  })

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="stretch"
      spacing={2}
    >
      <Grid item xs={6}>
        <GalaxyMapCard
          galaxyId={galaxy?.id}
          galaxyPlateifu={galaxy?.plateifu}
          minHeight='40vw'
        ></GalaxyMapCard>
      </Grid>
      {/* <Grid item xs={6}>
        <GalaxySpectrumCard
          galaxyId={galaxy?.id}
          position={[49, 43]}
          minHeight='40vw'
        >
        </GalaxySpectrumCard>
      </Grid>
      <Grid item xs={6}>
        <GalaxyStellarCard
          galaxyId={galaxy?.id}
          position={[36, 35]}
          minHeight='20vw'
        >
        </GalaxyStellarCard>
      </Grid>
      <Grid item xs={6}>
        <GalaxyBinedCard
          galaxyId={galaxy?.id}
          position={[42, 30]}
          minHeight='20vw'
        >
        </GalaxyBinedCard> 
      </Grid>*/}
      <GenericError open={errorIsOpen} onClose={()=>setErrorIsOpen(false)} />
    </Grid>
  );
}
ExplorerImageLayout.defaultProps = {
  galaxy: undefined
}
ExplorerImageLayout.propTypes = {
  galaxy: PropTypes.object
};

