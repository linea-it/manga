import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { dark } from '@material-ui/core/styles/createPalette';

function Vecs({ data, height }) {
  const [rows, setRows] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  const Plot = createPlotlyComponent(Plotly);

  useEffect(() => {
    if(data.x.length > 0 && data.y.length > 0 && data.m.length > 0) {
      const annotationList = [];
      const rowList = [];

      data.x.forEach((row, i) => {
        rowList.push({
          x: [row],
          y: [data.y[i]],
          name: data.m[i],
          type: 'bar',
          marker: {
            opacity: 0.75,
          },
        });

        // annotationList.push({
        //   x: row,
        //   y: data.y[i],
        //   text: data.m[i],
        //   textangle: '-90',
        //   font: {
        //     family: 'sans serif',
        //     size: 15,
        //   },
        //   showarrow: false
        // })
      })

      setRows(rowList)
      setAnnotations(annotationList)
    }
  }, [data])


  return (
    <Plot
      data={rows}
      layout={{
        height: height,
        margin: {
          t: 30,
          b: 30,
          r: 20,
        },
        // annotations: annotations,
        yaxis: {
          range: [0, 100]
        },
        xaxis: {
          title: 'Vecs',
        },
        hovermode: 'closest',
        autosize: true,
      }}
    />
  )
}

Vecs.propTypes = {
  data: PropTypes.shape({
    x: PropTypes.arrayOf(
      PropTypes.number
    ),
    y: PropTypes.arrayOf(
      PropTypes.number
    ),
    m: PropTypes.arrayOf(
      PropTypes.string
    ),
  }).isRequired
}

export default Vecs;