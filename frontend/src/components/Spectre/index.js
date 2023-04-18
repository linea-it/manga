import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardContent, Grid, CircularProgress, Typography, Box } from '@material-ui/core';
import Age from '../../components/Plot/Age';
import Vecs from '../../components/Plot/Vecs';
import styles from './styles';

function Spectre({
  heatmapPoints,
  fluxPlotData,
  heatmapSize,
  agePlotData,
  vecsPlotData,
  isLoading
}) {
  const classes = styles();

  if (isLoading === true) {
    return (
      <Card>
        <CardHeader title="Spectrum and Histograms" />
        <CardContent >      
          <Box 
          display="flex" 
          height={heatmapSize.height + 97} 
          alignItems="center"
          justifyContent="center"
          m="auto"
          flexDirection="column" 
        >
            <Box p={1} alignSelf="center">
              <CircularProgress color="secondary" />
            </Box>
            <Box p={1} alignSelf="center">
              <Typography variant="body2" color="textSecondary" component="p">
                This request can take a while, but only the first time for each object. {' '}
              </Typography>
            </Box> 
            <Box p={1} alignSelf="center">
              <Typography variant="body2" color="textSecondary" component="p">            
                We keep the compressed files and in the first request we uncompress the file and it is available in the cache for a while. If there is any failure try again after a few minutes.
              </Typography>
            </Box>             
          </Box>                  
        </CardContent>
      </Card>    
    )
  }
  
  return (
    <Card>
      <CardHeader title="Spectrum and Histograms" />
      <CardContent>
          {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 ? (
          <Grid container className={classes.animateEnter}>
            <Grid item xs={12}>
              <Plot
                title="top of the morning"
                data={[
                  {
                    x: fluxPlotData.lamb,
                    y: fluxPlotData.flux,
                    name: 'Flux',
                  },
                  {
                    x: fluxPlotData.lamb,
                    y: fluxPlotData.synt,
                    name: 'Synt',
                  },
                ]}
                className={classes.plotWrapper}
                layout={{
                  hovermode: 'closest',
                  autosize: true,
                  // width: heatmapSize.width + 100,
                  height: (heatmapSize.height + 178) / 2,
                  margin: {
                    t: 30,
                    b: 20,
                  },
                  title: `x=${heatmapPoints[0]}, y=${heatmapPoints[1]}`,
                }}
                config={{
                  scrollZoom: false,
                  displaylogo: false,
                  responsive: true,
                  displayModeBar: 'hover',
                }}
                transition={{
                  duration: 500,
                  easing: 'cubic-in-out',
                }}
                frame={{ duration: 500 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Age data={agePlotData} height={heatmapSize.height / 2} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Vecs data={vecsPlotData} height={heatmapSize.height / 2} />
            </Grid>
          </Grid>
        ) : (
          <div style={{ height: heatmapSize.height + 97 }} />
        )}
      </CardContent>
    </Card>
  );
}

export default Spectre;
