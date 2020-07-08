import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Heatmap from '../Plot/Heatmap';
import { getOriginalImageHeatmap } from '../../services/api';

function OriginalImage({ megacube, sectionWidth }) {
  const [originalImageData, setOriginalImageData] = useState([]);

  useEffect(() => {
    if (megacube) {
      getOriginalImageHeatmap({ megacube })
        .then((res) => setOriginalImageData(res.z));
    }
  }, [megacube]);

  return megacube
    ? <Heatmap z={originalImageData} sectionWidth={sectionWidth} />
    : null;
}

OriginalImage.defaultProps = {
  megacube: null,
};

OriginalImage.propTypes = {
  megacube: PropTypes.string,
  sectionWidth: PropTypes.number.isRequired,
};

export default OriginalImage;
