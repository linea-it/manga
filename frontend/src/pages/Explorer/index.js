import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Button, Icon, Typography, CardContent, Card, CardHeader, Box } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { getGalaxyById } from '../../services/api';
import { useQuery } from 'react-query'
import ExplorerToolbar from './partials/Toolbar';
import GalaxyMapCard from './partials/maps';
import GalaxySpectrumCard from './partials/Spectrum';
import GalaxyStellarCard from './partials/Stellar';
import GalaxyBinedCard from './partials/Bined';
import LinearProgress from '@material-ui/core/LinearProgress';
import MegacubeHeader from '../../components/MegacubeHeader';
// import MegacubeDownload from '../../components/MegacubeDownload';


function Explorer() {
  const { id } = useParams();
  const history = useHistory();
  const [error, setError] = React.useState(undefined)

  const [headerIsOpen, setHeaderIsOpen] = React.useState(false)

  const { data:galaxy, isLoading } = useQuery({
    queryKey: ['galaxyById', { id }],
    queryFn: getGalaxyById,
    keepPreviousData: true,
    refetchInterval: false,
    // refetchOnWindowFocus: false,
    // refetchOnmount: false,
    // refetchOnReconnect: false,
    retry: false,
    staleTime: 1 * 60 * 60 * 1000,
    onSuccess: data => {
      if (!data) {
        return
      }
      console.log("Loaded Galaxy:", data)

      return data
    },
    onError: error => {
      let msg = error.message
      if (error.response) {
        msg = error.response.data.message
      }
      setError(msg)
    }
  })

  const handleBackNavigation = () => history.goBack();

  const handleDownload = () => {console.log("handleDownload")};
  const handleHeader = () => {
    setHeaderIsOpen(!headerIsOpen)
  };
  

  return (
    <Box m={2} >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={3}
      > 
      <Grid item xs={12} >
        <>
          {isLoading && (<LinearProgress color="secondary" />)}
          <ExplorerToolbar 
          handleBackNavigation={handleBackNavigation} 
          handleDownload={handleDownload}
          handleHeader={handleHeader}/>
        </>
      </Grid>
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
      </Grid> */}
      {/* TODO: Utilizar o select no useQuery e adicionar o staleTime */}
      {/* <Grid item xs={6}>
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
      </Grid>                   */}
      </Grid>
      {galaxy?.id && (
        <MegacubeHeader galaxyId={galaxy.id} open={headerIsOpen} onClose={handleHeader} />
      )}
    </Box>
  );
}

export default Explorer;
