import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
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

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item>
        {megacube
          ? <Heatmap z={originalImageData} sectionWidth={sectionWidth} />
          : null}
      </Grid>
    </Grid>
  );
}

OriginalImage.defaultProps = {
  megacube: null,
};

OriginalImage.propTypes = {
  megacube: PropTypes.string,
  sectionWidth: PropTypes.number.isRequired,
};

export default OriginalImage;
