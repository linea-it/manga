import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import StellarPopulationPlot from '../../../../components/Stellar';
const useStyles = makeStyles(() => ({}));

export default function GalaxyStellarCard({ 
  galaxyId,
  position,
  minHeight
}) {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader title="Stellar Population Vectors" />
      <CardContent style={{ minHeight: minHeight }}>
        {
        galaxyId !== null 
        && position[0] !== null 
        && position[1] !== null 
        && (
          <StellarPopulationPlot 
            id={galaxyId} 
            x={position[0]} 
            y={position[1]} 
            />
        )}
      </CardContent>
    </Card>
  );
}
GalaxyStellarCard.defaultProps = {
  galaxyId: null,
  position: [null, null],
  minHeight: '20vw'
}
GalaxyStellarCard.propTypes = {
  galaxyId: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  minHeight: PropTypes.string
};