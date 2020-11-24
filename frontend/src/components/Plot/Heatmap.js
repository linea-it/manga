import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import useWindowSize from '../../hooks/useWindowSize';
import { HeatmapColorRange } from '../HeatmapSlider';
import { mergeArrayOfArrays } from '../../services/utils';
import useStyles from './styles';

function Heatmap({ z, sectionWidth }) {
  const windowSize = useWindowSize();
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(500);
  // const [colorLimits, setColorLimits] = useState([]);
  // const [colorRangeValue, setColorRangeValue] = useState([]);

  const classes = useStyles({ height });

  useEffect(() => {
    // const size = windowSize.height > sectionWidth ? sectionWidth : windowSize.height;

    // const margin = size * 0.025;
    // const ratio = size - margin;
    // setHeight(ratio);
    // setWidth(ratio);

    // const size = windowSize.height > sectionWidth ? sectionWidth : windowSize.height;

    // const heightMargin = size * 0.2;
    // const widthMargin = size * 0.03;

    // setHeight(size - heightMargin);
    // setWidth(size - widthMargin);

    setHeight(sectionWidth / 2);
    setWidth(sectionWidth / 2);
  }, [windowSize.height, sectionWidth]);


  // useEffect(() => {
  //   if (z.length > 0) {
  //     const mergedZ = mergeArrayOfArrays(z);
  //     setColorLimits([Math.min(...mergedZ), Math.max(...mergedZ)]);
  //     setColorRangeValue([Math.min(...mergedZ), Math.max(...mergedZ)]);
  //   }
  // }, [z]);

  // const handleColorRangeChange = (e, value) => {
  //   setColorRangeValue(value);
  // };

  return (
    <div className={classes.heatmapWrapper}>
      <Plot
        data={[
          {
            z,
            type: 'heatmap',
            colorscale: 'Viridis',
            fixedrange: true,
            zauto: false,
            // zmin: colorRangeValue[0],
            // zmax: colorRangeValue[1],
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
          },
          xaxis: {
            showticklabels: false,
            visible: false,
            constrain: 'domain',
          },
          margin: {
            t: 30,
            l: 0,
            b: 0,
            r: 0,
            pad: 0,
          },
          showSendToCloud: true,
        }}
        config={{
          // scrollZoom: false,
          // displaylogo: false,
          // responsive: true,
          // displayModeBar: 'hover',
          scrollZoom: false,
          displaylogo: false,
          responsive: true,
          displayModeBar: false,
          staticPlot: true,
        }}
        transition={{
          duration: 500,
          easing: 'cubic-in-out',
        }}
      />
      {/* <HeatmapColorRange
        className={classes.colorRange}
        orientation="vertical"
        max={colorLimits[1]}
        min={colorLimits[0]}
        value={colorRangeValue}
        valueLabelDisplay="off"
        onChange={handleColorRangeChange}
      /> */}
    </div>
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
