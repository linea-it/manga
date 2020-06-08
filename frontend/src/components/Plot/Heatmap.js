import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import useWindowSize from '../../hooks/useWindowSize';


function Heatmap({ z, sectionWidth }) {
  const windowSize = useWindowSize();
  const Plot = createPlotlyComponent(Plotly);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(500);

  useEffect(() => {
    const size = windowSize.height > sectionWidth ? sectionWidth : windowSize.height;

    const margin = size * 0.025;
    const ratio = size - margin;
    setHeight(ratio);
    setWidth(ratio);
  }, [windowSize.height, sectionWidth]);


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
        width,
        hovermode: 'closest',
        yaxis: {
          showticklabels: false,
          visible: false,
          scaleanchor: 'x',
          scaleratio: 1,
        },
        xaxis: {
          showticklabels: false,
          visible: false,
          constrain: 'domain',
        },
        margin: {
          t: 30,
          l: 30,
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
  sectionWidth: PropTypes.number.isRequired,
};

export default Heatmap;
