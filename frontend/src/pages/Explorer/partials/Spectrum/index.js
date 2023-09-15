import React from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import SpectrumLinesPlot from '../../../../components/Spectrum';

const useStyles = makeStyles(() => ({}));

export default function GalaxySpectrumCard({
  galaxyId,
  position,
  minHeight
}) {
  const classes = useStyles();

  return (
    <Card elevation={3}>
      <CardHeader title="Spectrum and Histograms" />
      <CardContent style={{ minHeight: minHeight }}>
        {
        galaxyId !== null
        && position[0] !== null
        && position[1] !== null
        && (
          <SpectrumLinesPlot
            id={galaxyId}
            x={position[0]}
            y={position[1]}
            />
        )}
      </CardContent>
    </Card>
  );
}
GalaxySpectrumCard.defaultProps = {
  galaxyId: null,
  position: [null, null],
  minHeight: '40vw'
}
GalaxySpectrumCard.propTypes = {
  galaxyId: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  minHeight: PropTypes.string
};
