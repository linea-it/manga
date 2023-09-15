import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query'
import { CircularProgress } from '@mui/material';
import ColorRange from './ColorRange';
import Box from '@mui/material/Box';
import Plot from 'react-plotly.js';
import GenericError from '../Alerts/GenericError';
import { getAllHeatmaps } from '../../services/api';

const useStyles = makeStyles((theme) => ({
  plotWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));

function Heatmap(props) {
  const classes = useStyles();
  const { galaxyId, mapHdu, contourHdu, onClick } = props

  const [map, setMap] = React.useState()
  const [mapRange, setMapRange] = React.useState([0, 100])
  const [contour, setCountour] = React.useState()
  const [contourRange, setContourRange] = React.useState(100)
  const [points, setPoints] = React.useState([])
  const [plotData, setPlotData] = React.useState([])
  const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  const { data: maps, isLoading } = useQuery({
    queryKey: ['MapsByGalaxyId', { id: galaxyId }],
    queryFn: getAllHeatmaps,
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

    if (map) {
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
    }

    if (contour) {
      const countour_data = {
        z: contour.z,
        type: 'contour',
        showlegend: false,
        contours: {
          coloring: 'none',
          start: contour ? contour.min : 0,
          end: contourRange,
        },
        line: {
          color: 'white',
          smoothing: 0.85,
        },
        hoverinfo: 'x+y+z',
      }
      data.push(countour_data)
    }
    // Marcadores de posição do click
    data.push({
      type: 'scatter',
      x: [
        points[0] === 0 ? null : points[0],
        0
      ],
      y: [
        points[1] === 0 ? null : points[1],
        points[1],
      ],
      mode: 'lines',
      line: {
        color: 'rgba(255, 255, 255, .7)',
        width: 3,
      },
      hoverinfo: 'skip',
      showlegend: false,
    })
    data.push({
      type: 'scatter',
      x: [
        points[0] === 0 ? null : points[0],
        points[0],
      ],
      y: [points[1] === 0 ? null : points[1], 0],
      mode: 'lines',
      line: {
        color: 'rgba(255, 255, 255, .4)',
        width: 3,
      },
      hoverinfo: 'skip',
      showlegend: false,
    })
    data.push({
      x: [points[0] === 0 ? null : points[0]],
      y: [points[1] === 0 ? null : points[1]],
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: 'rgba(0, 0, 0, .8)',
        size: 6,
        line: {
          color: 'rgba(255, 255, 255, .5)',
          width: 3,
        },
      },
      hoverinfo: 'skip',
      showlegend: false,
    })
    data.push({
      type: 'scatter',
      x: [points[0] === 0 ? null : points[0], 0],
      y: [
        points[1] === 0 ? null : points[1],
        points[1],
      ],
      mode: 'lines',
      line: {
        color: 'rgba(0, 0, 0, .8)',
        width: 3,
        dash: 'dot',
      },
      hoverinfo: 'skip',
      showlegend: false,
    })
    data.push({
      type: 'scatter',
      x: [
        points[0] === 0 ? null : points[0],
        points[0],
      ],
      y: [points[1] === 0 ? null : points[1], 0],
      mode: 'lines',
      line: {
        color: 'rgba(0, 0, 0, .8)',
        width: 3,
        dash: 'dot',
      },
      hoverinfo: 'skip',
      showlegend: false,
    })
    setPlotData(data)
  }, [map, mapRange, contour, contourRange, points ])

  const changeMap = React.useCallback(() => {
    if (maps === undefined) return

    if (mapHdu in maps) {
      if (map === undefined || map.internal_name !== mapHdu) {
        setMap(maps[mapHdu])
        setMapRange([maps[mapHdu].min, maps[mapHdu].max])
      }
    } else {
      setMap(undefined)
      setContourRange([0, 100])
    }

    if (contourHdu in maps) {
      if (contour === undefined || contour.internal_name !== contourHdu) {
        setCountour(maps[contourHdu])
        setContourRange(maps[contourHdu].max)
      }
    } else {
      setCountour(undefined)
      setContourRange(100)
    }
  }, [maps, map, mapHdu, contour, contourHdu])

  React.useEffect(() => {
    changeMap()
  }, [maps, mapHdu, contourHdu, changeMap])


  React.useEffect(() => {
    makePlotData()
  }, [map, mapRange, contour, contourRange, points, makePlotData])

  const onChangeMapRange = (e, value) => {
    setMapRange(value)
  }
  const onChangeContourRange = (e, value) => {
    setContourRange(value)
  }

  const handleHeatmapClick = (e) => {
    const newPoints = [e.points[0].x, e.points[0].y]
    if (newPoints !== points) {
      setPoints(newPoints);
      onClick(newPoints)
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="stretch"
      alignContent="stretch"
      sx={{ height: '100%' }}
    >
      {/* Map Color Range */}
      <ColorRange
        min={map?.min}
        max={map?.max}
        value={mapRange}
        onChange={onChangeMapRange}
        disabled={!map}
      />
      <Box
        display="block"
        flexGrow={1}
        position="relative"
        sx={{
          minWidth: 250,
          minHeight: 250
        }}
      >
        {isLoading && (
        <div className={classes.plotWrapper}><CircularProgress color="secondary" /></div>)}
        {!isLoading && (
          <Plot
            className={classes.plotWrapper}
            useResizeHandler={true}
            data={plotData}
            layout={{
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
                l: 30,
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
              displayModeBar: 'hover',
            }}
            transition={{
              duration: 500,
              easing: 'cubic-in-out',
            }}
            frame={{ duration: 500 }}
            onClick={handleHeatmapClick}
          />
        )}
      </Box>
      {/* Contour Range Filter */}
      <ColorRange
        min={contour?.min}
        max={contour?.max}
        value={contourRange}
        onChange={onChangeContourRange}
        disabled={!contour}
      />
      <GenericError open={errorIsOpen} onClose={() => setErrorIsOpen(false)} />
    </Box>
  )
}

Heatmap.defaultProps = {
  contourHdu: ''
}

Heatmap.propTypes = {
  galaxyId: PropTypes.number.isRequired,
  mapHdu: PropTypes.string.isRequired,
  contourHdu: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default Heatmap
