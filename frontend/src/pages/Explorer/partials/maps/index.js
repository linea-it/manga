import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
const useStyles = makeStyles(() => ({}));

export default function GalaxyMapCard({ 
  galaxyId,
  galaxyPlateifu,
  minHeight 
}) {
  const classes = useStyles();

  return (
    <Card elevation={3}>
      <CardHeader title={`Galaxy: ${galaxyPlateifu}`} />
      <CardContent style={{ minHeight: minHeight }}>
        Galaxy
      </CardContent>
    </Card>
  );
}
GalaxyMapCard.defaultProps = {
  galaxyId: null,
  galaxyPlateifu: '',
  minHeight: '40vw'
}
GalaxyMapCard.propTypes = {
  galaxyId: PropTypes.number,
  galaxyPlateifu: PropTypes.string,
  minHeight: PropTypes.string
};