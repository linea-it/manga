import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query'
import { getHdus } from '../../services/api';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import useInterval from '../../hooks/useInterval';
import { IOSSlider } from '../Slider';


function HduSlider(props) {

  const { galaxyId, selected, onChange } = props
  const [isPlaying, setIsPlaying] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['HdusByGalaxyId', { id: galaxyId }],
    queryFn: getHdus,
    select: (records) => {
      return Array().concat(records.stellar_maps, records.gas_maps)
    },
    keepPreviousData: true,
    refetchInterval: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const getIdxByName = (name) => {
    if (data && data.length > 0) {
      return data.findIndex(o => o.internal_name === name)
    }
    return
  }

  const selectedIdx = getIdxByName(selected)
  const max = data ? (data.length  -1 ) : 0


  const handleChange = (event, newValue) => {
    if (newValue !== selectedIdx) {
      onChange(data[newValue].internal_name);
    }
  };

  const handlePlayStop = () => setIsPlaying(!isPlaying);

  useInterval(
    () => {
      if (selectedIdx === max) {
        handleChange(undefined, 0);
      } else {
        const newValue = (selectedIdx + 1)
        handleChange(undefined, newValue);
      }
    },
    isPlaying ? 1000 : null
  );

  // console.log(`selectedIdx: ${selectedIdx} isPlaying: ${isPlaying}`)
  return (
    <Box display="flex" alignItems="center" ml={2}>
      <IOSSlider
        max={max}
        min={0}
        value={selectedIdx ? selectedIdx : 0}
        marks
        step={1}
        valueLabelDisplay="off"
        disabled={isLoading}
        onChange={handleChange}
      />
      <IconButton
        aria-label="play/pause"
        onClick={handlePlayStop}
        disabled={isLoading}
        ml={1}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </Box>
  )
}
HduSlider.defaultProps = {
  galaxyId: undefined,
  selected: ''
}

HduSlider.propTypes = {
  galaxyId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string
};

export default HduSlider;
