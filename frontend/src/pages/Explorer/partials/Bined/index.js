import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import BinedPopulationPlot from '../../../../components/StellarVecs';
const useStyles = makeStyles(() => ({}));

export default function GalaxyBinedCard({
  galaxyId,
  position,
  minHeight
}) {
  const classes = useStyles();

  return (
    <Card elevation={3}>
      <CardHeader title="Bined Population Vectors" />
      <CardContent style={{ minHeight: minHeight }}>
        {
        galaxyId !== null
        && position[0] !== null
        && position[1] !== null
        && (
          <BinedPopulationPlot
            id={galaxyId}
            x={position[0]}
            y={position[1]}
            />
        )}
      </CardContent>
    </Card>
  );
}
GalaxyBinedCard.defaultProps = {
  galaxyId: null,
  position: [null, null],
  minHeight: '20vw'
}
GalaxyBinedCard.propTypes = {
  galaxyId: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  minHeight: PropTypes.string
};
