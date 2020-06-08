import React from 'react';
import { Skeleton } from '@material-ui/lab';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import styles from './styles';

function Spectre({
  heatmapPoints,
  fluxPlotData,
  heatmapSize,
}) {
  const classes = styles();
  const Plot = createPlotlyComponent(Plotly);

  return (
    <>
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
              height: heatmapSize.height,
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
        <Skeleton height={400} />
      )}
    </>
  );
}

export default Spectre;
