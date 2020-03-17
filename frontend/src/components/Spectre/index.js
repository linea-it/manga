import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import styles from './styles';

function Spectre({
  heatmapPoints,
  fluxPlotData,
  heatmapSize,
  selectedImage,
}) {
  const classes = styles();
  const Plot = createPlotlyComponent(Plotly);

  return (
    <Card>
      <CardHeader
        title="Spectre"
      />
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
                height: heatmapSize && heatmapSize.height ? heatmapSize.height - 40 : 0,
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
          <Skeleton height={selectedImage.id !== 0 && heatmapSize && heatmapSize.height ? heatmapSize.height - 40 : 20} />
        )}
      </CardContent>
    </Card>
  );
}

export default Spectre;
