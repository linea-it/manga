import React, { useEffect } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  IconButton,
  Snackbar,
  SnackbarContent,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import clsx from 'clsx';
import styles from './styles';
import { HeatmapSlider, HeatmapColorRange } from '../HeatmapSlider';
import useWindowSize from '../../hooks/useWindowSize';

function Galaxy({
  setHeatmapSize,
  selectedImage,
  handleSelectImage,
  selectedMegacube,
  hudList,
  handleSelectContour,
  heatmapError,
  heatmapPlotImageData,
  heatmapPlotContourData,
  heatmapColorRangeValue,
  heatmapPoints,
  selectedContour,
  handleHeatmapClick,
  heatmapSize,
  heatmapValueLimits,
  handleHeatmapColorRangeChange,
  heatmapSliderValue,
  handleHeatmapSliderChange,
  handlePlayClick,
  isPlaying,
}) {
  const classes = styles();
  const windowSize = useWindowSize();
  const Plot = createPlotlyComponent(Plotly);

  useEffect(() => {
    const size = windowSize.width;

    let marginHeight = size * 0.77;
    let marginWidth = size * 0.70;


    if(windowSize.width < 1920 && windowSize.width >= 960 ) {
      marginHeight = size * 0.67;
      marginWidth = size * 0.6;
    } else if (windowSize.width < 960) {
      marginHeight = size * 0.3;
      marginWidth = size * 0.2;
    }

    const ratioHeight = size - marginHeight;
    const ratioWidth = size - marginWidth;

    setHeatmapSize({ width: ratioWidth, height: ratioHeight });
  }, [windowSize.width]);

  return (
    <Card>
      <CardHeader title="Galaxy" />
      <CardContent>
        {selectedImage.id === 0 ? (
          <Skeleton height={400} />
        ) : (
          <Grid container spacing={2} className={classes.animateEnter}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <form autoComplete="off">
                    <FormControl fullWidth className={classes.textAlignLeft}>
                      <InputLabel htmlFor="input">Type</InputLabel>
                      <Select
                        value={selectedImage.id || 0}
                        onChange={handleSelectImage}
                        disabled={selectedMegacube === ''}
                      >
                        {hudList.map((hud, i) => (
                          <MenuItem
                            key={hud.name}
                            value={i + 1}
                          >
                            {hud.display_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </form>
                </Grid>
                <Grid item xs={12} md={6}>
                  <form autoComplete="off">
                    <FormControl fullWidth className={classes.textAlignLeft}>
                      <InputLabel htmlFor="input">Contour</InputLabel>
                      <Select
                        value={selectedContour.id}
                        onChange={handleSelectContour}
                        disabled={selectedMegacube === ''}
                      >
                        {hudList.filter((image, i) => i + 1 !== selectedImage.id).map((hud, i) => (
                          <MenuItem
                            key={hud.name}
                            value={i + 1}
                          >
                            {hud.display_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </form>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.positionRelative}>
                <Plot
                  data={[
                    {
                      z: heatmapError === '' ? heatmapPlotImageData.z : [],
                      type: 'heatmap',
                      colorscale: 'Viridis',
                      fixedrange: true,
                      zauto: false,
                      zmin: heatmapColorRangeValue[0],
                      zmax: heatmapColorRangeValue[1],
                      hoverinfo: 'x+y+z',
                    },
                    {
                      z: heatmapError === '' ? heatmapPlotContourData.z : [],
                      type: 'contour',
                      showlegend: false,
                      contours: {
                        coloring: 'none',
                      },
                      line: {
                        color: 'white',
                        smoothing: 0.85,
                      },
                    },
                    {
                      type: 'scatter',
                      x: [heatmapPoints[0] === 0
                        ? null
                        : heatmapPoints[0], 0],
                      y: [heatmapPoints[1] === 0
                        ? null
                        : heatmapPoints[1], heatmapPoints[1]],
                      mode: 'lines',
                      line: {
                        color: 'rgba(255, 255, 255, .7)',
                        width: 6,
                      },
                      hoverinfo: 'skip',
                      showlegend: false,
                    },
                    {
                      type: 'scatter',
                      x: [heatmapPoints[0] === 0
                        ? null
                        : heatmapPoints[0], heatmapPoints[0]],
                      y: [heatmapPoints[1] === 0
                        ? null
                        : heatmapPoints[1], 0],
                      mode: 'lines',
                      line: {
                        color: 'rgba(255, 255, 255, .4)',
                        width: 6,
                      },
                      hoverinfo: 'skip',
                      showlegend: false,
                    },
                    {
                      x: [heatmapPoints[0] === 0
                        ? null
                        : heatmapPoints[0]],
                      y: [heatmapPoints[1] === 0
                        ? null
                        : heatmapPoints[1]],
                      type: 'scatter',
                      mode: 'markers',
                      marker: {
                        color: 'rgba(0, 0, 0, .8)',
                        size: 13,
                        line: {
                          color: 'rgba(255, 255, 255, .5)',
                          width: 3,
                        },
                      },
                      hoverinfo: 'skip',
                      showlegend: false,
                    },
                    {
                      type: 'scatter',
                      x: [heatmapPoints[0] === 0
                        ? null
                        : heatmapPoints[0], 0],
                      y: [heatmapPoints[1] === 0
                        ? null
                        : heatmapPoints[1], heatmapPoints[1]],
                      mode: 'lines',
                      line: {
                        color: 'rgba(0, 0, 0, .8)',
                        width: 3,
                        dash: 'dot',
                      },
                      hoverinfo: 'skip',
                      showlegend: false,
                    },
                    {
                      type: 'scatter',
                      x: [heatmapPoints[0] === 0
                        ? null
                        : heatmapPoints[0], heatmapPoints[0]],
                      y: [heatmapPoints[1] === 0
                        ? null
                        : heatmapPoints[1], 0],
                      mode: 'lines',
                      line: {
                        color: 'rgba(0, 0, 0, .8)',
                        width: 3,
                        dash: 'dot',
                      },
                      hoverinfo: 'skip',
                      showlegend: false,
                    },
                  ]}
                  className={classes.plotWrapper}
                  layout={{
                    hovermode: 'closest',
                    colorscale: {
                      zmin: heatmapColorRangeValue[0],
                      zmax: heatmapColorRangeValue[1],
                    },
                    width: heatmapSize.width,
                    height: heatmapSize.height,
                    margin: {
                      l: 30,
                      pad: 0,
                      t: 50,
                      b: 50,
                    },
                    yaxis: {
                      scaleanchor: 'x',
                    },
                    showSendToCloud: true,
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

                <HeatmapColorRange
                  style={{
                    position: 'absolute',
                    right: -7,
                    top: 60,
                    maxHeight: heatmapSize.height - 110,
                  }}
                  orientation="vertical"
                        // aria-label="Heatmap Color Range"
                  max={heatmapValueLimits[1]}
                  min={heatmapValueLimits[0]}
                  value={heatmapColorRangeValue}
                  valueLabelDisplay="off"
                  className={classes.colorRange}
                  onChange={handleHeatmapColorRangeChange}
                />
              </Grid>

              <Grid item xs={12} className={classes.textAlignCenter}>
                <HeatmapSlider
                  max={hudList.length}
                  min={1}
                  value={heatmapSliderValue}
                  marks
                  step={1}
                  valueLabelDisplay="on"
                  className={classes.slider}
                  onChange={handleHeatmapSliderChange}
                />

                <IconButton
                  onClick={handlePlayClick}
                  title="Play"
                  className={classes.playButton}
                >
                  <Icon className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                </IconButton>
              </Grid>
              {heatmapError !== '' ? (
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={heatmapError !== ''}
                >
                  <SnackbarContent
                    className={classes.error}
                    message={(
                      <span className={classes.message}>
                        <Icon className={clsx('fa fa-exclamation-triangle', classes.iconError)} />
                        {heatmapError}
                      </span>
                    )}
                  />
                </Snackbar>
              ) : null}
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

export default Galaxy;
