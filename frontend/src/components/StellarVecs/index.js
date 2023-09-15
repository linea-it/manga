import React, { useRef } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Typography, Box } from '@mui/material';
import { useQuery } from 'react-query'
import { vecsByPosition } from '../../services/api';
import PropTypes from 'prop-types';

function BinedPopulationPlot(props) {
  const ref = useRef(null);

  const { id, x, y } = props
  // const [error, setError] = React.useState(null)
  const { data, isLoading } = useQuery({
    queryKey: ['BinedStellarPlotData', { id, x, y }],
    queryFn: vecsByPosition,
    keepPreviousData: false,
    refetchInterval: false,
    retry: false,
    staleTime: 1 * 60 * 60 * 1000,
    select: makePlotData,
    // onError: error => {
    //   let msg = error.message
    //   if (error.response) {
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     // console.log(error.response.data);
    //     // console.log(error.response.status);
    //     // console.log(error.response.headers);
    //     msg = error.response.data.message
    //   } else if (error.request) {
    //     // The request was made but no response was received
    //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //     // http.ClientRequest in node.js
    //     console.log(error.request)
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.log('Error', error.message)
    //   }
    //   setError(msg)
    // }
  })

  function makePlotData(data) {
    const plotData = []

    data.x.forEach((row, i) => {
      plotData.push({
        x: [row],
        y: [data.y[i]],
        name: data.m[i],
        type: 'bar',
        marker: {
          opacity: 0.75,
        },
      });
    });

    return plotData
  }

  if (x === 0 && x === 0) return (<box />)

  if (isLoading === true) {
    return (
      <Box
        display="flex"
        height={props.height}
        alignItems="center"
        justifyContent="center"
        m="auto"
        flexDirection="column"
      >
        <Box p={1} alignSelf="center">
          <CircularProgress color="secondary" />
        </Box>
        <Box p={1} alignSelf="center">
          <Typography variant="body2" color="textSecondary" component="p">
            This request can take a while, but only the first time for each object. {' '}
          </Typography>
        </Box>
        <Box p={1} alignSelf="center">
          <Typography variant="body2" color="textSecondary" component="p">
            We keep the compressed files and in the first request we uncompress the file and it is available in the cache for a while. If there is any failure try again after a few minutes.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      ref={ref}
      m="auto"
      alignItems="center"
      justifyContent="center"
      minHeight={550}>
      <Plot
        data={data}
        layout={{
          hovermode: 'closest',
          autosize: true,
          title: x !== undefined ? `x=${x}, y=${y}` : '',
          height: props.height,
          margin: {
            autoexpand: true,
          },
          xaxis: {
            title: 'Vecs',
          },
          yaxis: {
            range: [0, 100],
          }
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
      />
    </Box>
  )
}

BinedPopulationPlot.propTypes = {
  id: PropTypes.number.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number
};


export default BinedPopulationPlot;
