import React from 'react';
import PropTypes from 'prop-types';
import Heatmap from '../Plot/Heatmap';
import useStyles from './styles';

function OriginalImage({ data, sectionWidth }) {
  const classes = useStyles({ sectionWidth });

  return (
    <div className={classes.root}>
      <Heatmap z={data.z} sectionWidth={sectionWidth} />
      {data.sdss_image ? (
        <div className={classes.imgContainer}>
          <img
            alt="Original"
            src={data.sdss_image}
            className={classes.img}
          />
        </div>
      ) : null}
    </div>
  )
}

OriginalImage.propTypes = {
  data: PropTypes.shape({
    z: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    title: PropTypes.string,
    sdss_image: PropTypes.string
  }).isRequired,
  sectionWidth: PropTypes.number.isRequired,
};

export default OriginalImage;
