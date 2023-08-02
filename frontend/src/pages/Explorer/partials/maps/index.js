import React from 'react';
import { useQuery } from 'react-query'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { getHdus } from '../../../../services/api';
import GenericError from '../../../../components/Alerts/GenericError';
import HduSelect from '../../../../components/HduSelect';
const useStyles = makeStyles(() => ({}));



export default function GalaxyMapCard({ 
  galaxy,
  minHeight 
}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    type: 'f_norm',
    contour: '',
  })

  const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  const { data: hdus, isLoading } = useQuery({
    queryKey: ['HdusByGalaxyId', { id: galaxy.id }],
    queryFn: getHdus,
    keepPreviousData: true,
    refetchInterval: false,
    retry: 1,
    staleTime: 1 * 60 * 60 * 1000,
    onError: () => { setErrorIsOpen(true) }
  })

  const onChangeType = value => {
    console.log('onChangeType: ', value)
    setState({ ...state, type: value });
  }

  const onChangeContour = value => {
    console.log('onChangeContour: ', value)
    setState({ ...state, contour: value });
  }

  return (
    <>      
      <Card elevation={3}>
        <CardHeader title={`Galaxy: ${galaxy.plateifu}`} />
        <CardContent style={{ minHeight: minHeight }}>
            <HduSelect 
              galaxyId={galaxy.id} 
              inputLabel={'Type'}
              selected={state.type}
              onChange={onChangeType} 
              />
            <HduSelect 
              galaxyId={galaxy.id} 
              inputLabel={'Contour'} 
              selected={state.contour} 
              onChange={onChangeContour}
              allowEmpty={true}
              />
        </CardContent>
      </Card>
      <GenericError open={errorIsOpen} onClose={()=>setErrorIsOpen(false)} />
    </>
  );
}
GalaxyMapCard.defaultProps = {
  minHeight: '40vw'
}
GalaxyMapCard.propTypes = {
  galaxy: PropTypes.object.isRequired,
  minHeight: PropTypes.string
};