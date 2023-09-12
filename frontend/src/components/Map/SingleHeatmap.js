import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query'
import { CircularProgress } from '@mui/material';
import ColorRange from './ColorRange';
import Box from '@mui/material/Box';
import Plot from 'react-plotly.js';
import GenericError from '../Alerts/GenericError';
import { getHeatmapByHdu } from '../../services/api';

const useStyles = makeStyles((theme) => ({
  plotWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    wrap: "nowrap",
    flex: 1
  },
}));

function SingleHeatmap(props) {
  const classes = useStyles();
  const { galaxyId, mapHdu } = props

  const [mapRange, setMapRange] = React.useState([0, 100])
  const [plotData, setPlotData] = React.useState([])
  const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  const { data: map, isLoading } = useQuery({
    queryKey: ['MapByHdu', { id: galaxyId, hdu: mapHdu }],
    queryFn: getHeatmapByHdu,
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnmount: false,
    refetchOnWindowFocus: false,
    // retry: 1,
    staleTime: 5 * 60 * 1000,
    onError: () => { setErrorIsOpen(true) }
  })

  const makePlotData = React.useCallback(() => {
    // console.log(`makePlotData: HDU: ${mapHdu} Range: ${mapRange}`)
    // console.log(`Contour: ${contourHdu} Range: ${contourRange} `)
    if (map === undefined) return

    const data = []

    const map_data = {
        z: map.z,
        type: 'heatmap',
        colorscale: 'Viridis',
        fixedrange: true,
        zauto: false,
        zmin: mapRange[0],
        zmax: mapRange[1],
        hoverinfo: 'x+y+z',
    }
    data.push(map_data)

    setPlotData(data)
  }, [map, mapRange])

  const changeMap = React.useCallback(() => {
    if (map === undefined) return

    setMapRange([map.min, map.max])
  }, [map])

  React.useEffect(() => {
    changeMap()
  }, [changeMap, map, mapHdu])


  React.useEffect(() => {
    makePlotData()
  }, [map, mapRange, makePlotData])

  const onChangeMapRange = (e, value) => {
    setMapRange(value)
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="stretch"
      alignContent="stretch"
      sx={{ 
        height: '100%',
        minHeight: 250,
        minWidth: 250
      }}
    >
      {/* Map Color Range */}
      {props.enableRange === true && (
        <ColorRange
        min={map?.min}
          max={map?.max}
          value={mapRange}
          onChange={onChangeMapRange}
          disabled={!map}
        />
      )}
      <Box
        display="block"
        flexGrow={1}
        position="relative"
      >
        {isLoading && (
        <div className={classes.plotWrapper}><CircularProgress color="secondary" /></div>)}
        {!isLoading && (
          <Plot
            className={classes.plotWrapper}
            useResizeHandler={true}
            data={plotData}
            layout={{
              // height: 250,
              // width: 250,
              title: {
                text: map ? `${map?.comment}` : '',
                font: {
                  size: 12
                }
              },
              autosize: true,
              hovermode: 'closest',
              colorscale: {
                zmin: mapRange[0],
                zmax: mapRange[1],
              },
              margin: {
                l: 35,
                t: 30,
                b: 30,
                pad: 0,
              },
              yaxis: {
                scaleanchor: 'x',
              },
              showSendToCloud: false,
            }}
            config={{
              scrollZoom: false,
              displaylogo: false,
              responsive: true,
              displayModeBar: false,
            }}
            transition={{
              duration: 500,
              easing: 'cubic-in-out',
            }}
            frame={{ duration: 500 }}
          />
        )}
      </Box>
      <GenericError open={errorIsOpen} onClose={() => setErrorIsOpen(false)} />
    </Box>
  )
}

SingleHeatmap.defaultProps = {
  enableRange: true
}

SingleHeatmap.propTypes = {
  galaxyId: PropTypes.number.isRequired,
  mapHdu: PropTypes.string.isRequired,
  enableRange: PropTypes.bool
};

export default SingleHeatmap