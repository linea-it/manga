import React, {useLayoutEffect, useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardMedia, CardContent, Grid, CircularProgress, Typography, Box } from '@material-ui/core';
// import styles from './styles';
import { useQuery } from 'react-query'
import { spectrumLinesByPosition } from '../../services/api';
import styles from './styles';

function SpectrumPlot(props) {
    const ref = useRef(null);
    const classes = styles();

    const {id, x, y } = props
    const [series, setSeries] = React.useState([])
    const [error, setError] = React.useState(null)


    const { status, isLoading } = useQuery({
        queryKey: ['SpectrumLinesPlotData', { id, x, y}],
        queryFn: spectrumLinesByPosition,
        keepPreviousData: false,
        refetchInterval: false,
        retry: false,
        onSuccess: data => {
          if (!data) {
            return
          }
          console.log(data)
          makePlotData(data)
        },
        onError: error => {
          let msg = error.message
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            msg = error.response.data.message
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
          setError(msg)
        }
      })

      function makePlotData(data) {

        const plotData = []
       
        const obs_spec = {
            name: "Obs. Spec",
            x: data.wavelength,
            y: data.obs_spec,            
            mode: 'lines',
            showlegend:true,
        }
        plotData.push(obs_spec)

        const synt_spec = {
            name: "Synt. Spec",
            x: data.wavelength,
            y: data.synt_spec,            
            mode: 'lines',
            showlegend:true,
        }
        plotData.push(synt_spec)

        let showlegend = true;        
        for (const key in data) {
            if (key !== 'wavelength' && key !== 'obs_spec' && key !== 'synt_spec') {
                const serie = {
                    name: "Emission-lines",
                    x: data.wavelength,
                    y: data[key],
                    legendgroup: "em_lines",
                    mode:"lines",
                    showlegend,
                    marker: {color: 'red'},
                    line: {
                      dash: 'dot',
                    }
                }

                plotData.push(serie)
                showlegend = false
            }
        }
        setSeries(plotData)
      }


    if (x === 0 && x === 0 ) return (<box />)

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
            // minWidth={600}
            m="auto"
            alignItems="center"
            justifyContent="center"           
            minHeight={550}>
            <Plot
                data={series}
                className={classes.plotWrapper}
                layout={{
                  hovermode: 'closest',
                  autosize: true,
                  title: `x=${x}, y=${y}`,
                  height: props.height,
                  // legend:{ 
                  //   orientation: "h",
                  // }
                  margin: {
                    autoexpand: true,
                  },
                  xaxis: {
                    title: 'Wavelength ($\AA$)',
                  },
                  yaxis: {
                    title: 'Spectral flux density',
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

export default SpectrumPlot;