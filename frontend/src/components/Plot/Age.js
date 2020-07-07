import React from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

function Age({ data, height }) {
  const Plot = createPlotlyComponent(Plotly);

  return (
    <Plot
      data={[
        {
          x: data.x,
          y: data.y,
          name: '∑𝑥ⱼ',
          type: 'bar',
          width: 0.8,
        },
        {
          x: data.x,
          y: data.m,
          name: '∑μⱼ',
          type: 'bar',
          width: 0.2,
          marker: {
            opacity: 0.85,
          },
        },
      ]}
      layout={{
        height,
        margin: {
          t: 30,
          b: 30,
          r: 20,
        },
        xaxis: {
          title: 'log(Age)',
        },
        yaxis: {
          title: '%',
          range: [0, 100],
        },
        hovermode: 'closest',
        autosize: true,
      }}
    />
  );
}

Age.propTypes = {
  data: PropTypes.shape({
    x: PropTypes.arrayOf(
      PropTypes.number,
    ),
    y: PropTypes.arrayOf(
      PropTypes.number,
    ),
    m: PropTypes.arrayOf(
      PropTypes.number,
    ),
  }).isRequired,
};

export default Age;
