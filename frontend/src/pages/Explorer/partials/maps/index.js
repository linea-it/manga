import React from 'react';
import { useQuery } from 'react-query'
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import GenericError from '../../../../components/Alerts/GenericError';
import HduSelect from '../../../../components/HduSelect/Select';
import HduSlider from '../../../../components/HduSelect/Slider';
import Heatmap from '../../../../components/Map/Heatmap';
import { getHdus } from '../../../../services/api';
import Stack from '@mui/material/Stack';

export default function GalaxyMapCard({
  galaxy,
  minHeight,
  onClick
}) {

  const [state, setState] = React.useState({
    mapHdu: 'f_norm',
    contourHdu: '',
  })

  const onChangeMapHdu = value => {
    setState({ ...state, mapHdu: value });
  }

  const onChangeContour = value => {
    setState({ ...state, contourHdu: value });
  }

  return (
    <>
      <Card elevation={3}>
        <CardHeader title={`Galaxy: ${galaxy.plateifu}`} />
        <CardContent style={{ minHeight: minHeight, display: "flex"}}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="stretch"
            flex={1}
            width="100%"
          >
            <Stack  
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ sm: 2}}
              mb={4}>
              <HduSelect
                galaxyId={galaxy.id}
                inputLabel={'Type'}
                selected={state.mapHdu}
                onChange={onChangeMapHdu}
                sx={{ mr: 1 }}
              />
              <HduSelect
                galaxyId={galaxy.id}
                inputLabel={'Contour'}
                selected={state.contourHdu}
                onChange={onChangeContour}
                allowEmpty={true}
              />
            </Stack>
              <Heatmap 
                galaxyId={galaxy.id}
                mapHdu={state.mapHdu}
                contourHdu={state.contourHdu}
                onClick={onClick}
              />
            <HduSlider
              galaxyId={galaxy.id}
              selected={state.mapHdu}
              onChange={onChangeMapHdu}
            >
            </HduSlider>
          </Box>
        </CardContent>
      </Card>
      {/* <GenericError open={errorIsOpen} onClose={() => setErrorIsOpen(false)} /> */}
    </>
  );
}
GalaxyMapCard.defaultProps = {
  minHeight: '40vw'
}
GalaxyMapCard.propTypes = {
  galaxy: PropTypes.object.isRequired,
  minHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired
};