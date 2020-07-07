import React from 'react';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { Card, CardHeader, CardContent, Grid } from '@material-ui/core';
import Age from '../../components/Plot/Age';
import Vecs from '../../components/Plot/Vecs';
import styles from './styles';

function Spectre({
  heatmapPoints,
  fluxPlotData,
  heatmapSize,
  agePlotData,
  vecsPlotData
}) {
  const classes = styles();
  const Plot = createPlotlyComponent(Plotly);

  return (
    <Card>
      <CardHeader title="Spectre and Histograms" />
      <CardContent>
        {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 ? (
          <Grid container className={classes.animateEnter}>
            <Grid item xs={12}>
              <Plot
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
