import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import SpectrumLinesPlot from '../../../../components/Spectrum';

const useStyles = makeStyles(() => ({}));

export default function GalaxySpectrumCard({ 
  galaxyId,
  position,
  minHeight
}) {
  const classes = useStyles();

  return (
    <Card>
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