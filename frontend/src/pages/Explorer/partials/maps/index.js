import React from 'react';
import { useQuery } from 'react-query'
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import GenericError from '../../../../components/Alerts/GenericError';
import HduSelect from '../../../../components/HduSelect/Select';
import HduSlider from '../../../../components/HduSelect/Slider';
import Heatmap from '../../../../components/Map/Heatmap';
import { getHdus } from '../../../../services/api';

export default function GalaxyMapCard({
  galaxy,
  minHeight,
  onClick
}) {

  const [state, setState] = React.useState({
    mapHdu: 'f_norm',
    contourHdu: '',
  })

  // const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  // const { data: hdus, isLoading } = useQuery({
  //   queryKey: ['HdusByGalaxyId', { id: galaxy.id }],
  //   queryFn: getHdus,
  //   keepPreviousData: true,
  //   refetchInterval: false,
  //   retry: 1,
  //   staleTime: 1 * 60 * 60 * 1000,
  //   onError: () => { setErrorIsOpen(true) }
  // })

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
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <HduSelect
                galaxyId={galaxy.id}
                inputLabel={'Type'}
                selected={state.mapHdu}
                onChange={onChangeMapHdu}
              />
              <HduSelect
                galaxyId={galaxy.id}
                inputLabel={'Contour'}
                selected={state.contourHdu}
                onChange={onChangeContour}
                allowEmpty={true}
              />
            </Box>
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