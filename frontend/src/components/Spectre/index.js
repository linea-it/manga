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


  const calculateSize = (width, margin) => {
    console.log('margin', margin);

    if (margin) {
      const m = (margin / 100) * parseInt(width);

      return parseInt(width) - m;
    }
    return parseInt(width);
  };

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
                height: parseInt(heatmapSize.height) - 80,
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
          <div style={{ height: parseInt(heatmapSize.height) - 80 }} />
        )}
      </CardContent>
    </Card>
  );
}

export default Spectre;
