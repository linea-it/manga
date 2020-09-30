import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Heatmap from '../Plot/Heatmap';

function OriginalImage({ data, sectionWidth }) {
  return <Heatmap z={data} sectionWidth={sectionWidth} />
}

OriginalImage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  sectionWidth: PropTypes.number.isRequired,
};

export default OriginalImage;
