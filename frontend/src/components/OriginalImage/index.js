import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Heatmap from '../Plot/Heatmap';
import { getOriginalImageHeatmap } from '../../services/api';

function OriginalImage({ megacube, size }) {
  const [originalImageData, setOriginalImageData] = useState([]);

  useEffect(() => {
    if (megacube) {
      getOriginalImageHeatmap({ megacube })
        .then((res) => setOriginalImageData(res.z));
    }
  }, [megacube]);

  return (

    <Grid container spacing={3} direction="row" alignItems="stretch">
      <Grid item xs={12}>
        {megacube
          ? <Heatmap z={originalImageData} />
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
};

export default OriginalImage;
