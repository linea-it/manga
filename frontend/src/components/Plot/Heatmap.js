import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import useWindowSize from '../../hooks/useWindowSize';


function Heatmap({ z }) {
  const windowSize = useWindowSize();
  const Plot = createPlotlyComponent(Plotly);
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const margin = windowSize.height * 0.1;
    const newHeight = windowSize.height - margin;
    setHeight(newHeight);
  }, [windowSize.height]);


  return (
    <Plot
      data={[
        {
          z,
          type: 'heatmap',
          colorscale: 'Viridis',
          fixedrange: true,
          zauto: true,
          hoverinfo: 'x+y+z',
          showscale: true,
        },
      ]}
      layout={{
        height,
        hovermode: 'closest',
        yaxis: {
          scaleanchor: 'x',
          scaleratio: 1,
          autosize: true,
          autorange: false,
          range: [0, 73],
        },
        xaxis: {
          autorange: false,
          range: [0, 73],
          constrain: 'domain',
        },
        margin: {
          t: 30,
          l: 0,
          r: 0,
          pad: 0,
        },
        showSendToCloud: true,
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
    />
  );
}

Heatmap.propTypes = {
  z: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number,
    ),
  ).isRequired,
};

export default Heatmap;
