import React from 'react';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import styles from './styles';

function Spectre({
  heatmapPoints,
  fluxPlotData,
  heatmapSize,
}) {
  const classes = styles();
  const Plot = createPlotlyComponent(Plotly);

  return (
    <Card>
      <CardHeader title="Spectre" />
      <CardContent>
        {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 ? (
          <div className={classes.animateEnter}>
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
                height: heatmapSize.height + 94,
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
          </div>
        ) : (
          <div style={{ height: heatmapSize.height + 97 }} />
        )}
      </CardContent>
    </Card>
  );
}

export default Spectre;
