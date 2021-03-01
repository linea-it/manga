import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Heatmap from '../Plot/Heatmap';
import useStyles from './styles';
import useWindowSize from '../../hooks/useWindowSize';

function OriginalImage({ data, sectionWidth }) {
  const windowSize = useWindowSize();
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(500);

  const classes = useStyles({ width });

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

    const marginTop = 64 + 52.5;
    const heightSize = windowSize.height - marginTop;

    setHeight(heightSize / 2);
    setWidth(heightSize / 2 + 70);
  }, [windowSize.height, sectionWidth]);

  return (
    <div className={classes.root}>
      <Heatmap z={data.z} width={width} height={height} />
      {data.sdss_image ? (
        <div className={classes.imgContainer}>
          <img alt="Original" src={data.sdss_image} className={classes.img} />
        </div>
      ) : null}
    </div>
  );
}

OriginalImage.propTypes = {
  data: PropTypes.shape({
    z: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    title: PropTypes.string,
    sdss_image: PropTypes.string,
  }).isRequired,
  sectionWidth: PropTypes.number.isRequired,
};

export default OriginalImage;
