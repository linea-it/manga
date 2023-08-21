import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import useStyles from './styles';

function Vecs({ data, height }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data.x.length > 0 && data.y.length > 0 && data.m.length > 0) {
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
      });

      setRows(rowList);
    }
  }, [data]);

  return (
    <div className={classes.vecWrapper}>
      <div className={classes.vecTooltipWrapper}>
        <Tooltip
          title={data.mlegend.map((item, i) => (
            <p>
              {data.m[i]}: {item}
            </p>
          ))}
        >
          <InfoIcon fontSize="inherit" />
        </Tooltip>
      </div>
      <Plot
        data={rows}
        layout={{
          height,
          margin: {
            t: 30,
            b: 30,
            r: 20,
          },
          yaxis: {
            range: [0, 100],
          },
          xaxis: {
            title: 'Vecs',
          },
          hovermode: 'closest',
          autosize: true,
        }}
        config={{
          displaylogo: false,
        }}
      />
    </div>
  );
}

Vecs.propTypes = {
  data: PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.number),
    y: PropTypes.arrayOf(PropTypes.number),
    m: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Vecs;
