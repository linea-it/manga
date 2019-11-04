import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import Slider from '@material-ui/core/Slider';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';
import { SizeMe } from 'react-sizeme';
import CustomTable from '../utils/CustomTable';
import {
  getFluxByPosition, getHudList, getImageHeatmap, getSpaxelFitByPosition,
} from '../api/Api';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
  btn: {
    textTransform: 'none',
    padding: '1px 5px',
    width: '7em',
    minHeight: '1em',
    display: 'block',
    textAlign: 'center',
    lineHeight: '2',
    boxShadow: `0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12)`,
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  input: {
    margin: 0,
  },
  plotWrapper: {
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('lg')]: {
      overflow: 'auto',
    },
  },
  animateEnter: {
    animation: 'fadein 1s',
    textAlign: 'center',
  },
  skeletonMargin: {
    marginTop: '0.8em',
    marginBottom: '0.8em',
  },
  cardContentTable: {
    maxHeight: 500,
    overflow: 'auto',
  },
  slider: {
    maxWidth: 'calc(100% - 130px)',
    marginLeft: 'auto',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  colorRange: {
    // maxWidth: 'calc(100% - 130px)',
  },
  playButton: {
    marginLeft: 10,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  iconError: {
    marginRight: 7,
    width: '1.2em',
    fontSize: '1rem',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
}));
const heatmapBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const HeatmapSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: heatmapBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    '&:focus,&:hover,&$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: heatmapBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 11px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);

const HeatmapColorRange = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: heatmapBoxShadow,
    marginTop: '-14px !important',
    marginLeft: '-14px !important',
    '&:focus,&:hover,&$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: heatmapBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    top: 8,
    left: -2,
    '& *': {
      background: 'transparent',
      color: '#444',
    },
  },
  track: {
    width: 2,
  },
  rail: {
    width: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    width: 8,
    height: 1,
    marginLeft: -4,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Verifier({ setTitle }) {
  const Plot = createPlotlyComponent(Plotly);
  const classes = useStyles();
  const [megacubeList] = useState(['manga-8138-6101-MEGA']);
  const [selectedMegacube, setSelectedMegacube] = useState(megacubeList[0]);
  const [hudList, setHudList] = useState([]);
  const [selectedImage, setSelectedImage] = useState({
    id: 0,
    name: '',
  });
  const [selectedContour, setSelectedContour] = useState({
    id: 0,
    name: '',
  });
  const [fluxPlotData, setFluxPlotData] = useState({});
  const [spaxelTableData, setSpaxelTableData] = useState({});
  const [heatmapPlotImageData, setHeatmapPlotImageData] = useState({});
  const [heatmapPlotContourData, setHeatmapPlotContourData] = useState({});
  const [heatmapError, setHeatmapError] = useState('');
  const [heatmapPoints, setHeatmapPoints] = useState([0, 0]);
  const [heatmapSliderValue, setHeatmapSliderValue] = useState(1);
  const [heatmapValueLimits, setHeatmapValueLimits] = useState([]);
  const [heatmapColorRangeValue, setHeatmapColorRangeValue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localHeatmaps, setLocalHeatmaps] = useState([]);
  const [heatmapSize, setHeatmapSize] = useState({ height: 450 });

  useEffect(() => {
    setTitle('Verifier');
  }, [setTitle]);

  useEffect(() => {
    getHudList({ megacube: selectedMegacube }).then((res) => {
      setHudList(res);
      setSelectedImage({
        id: 1,
        name: res[0].name,
      });
    });
  }, [selectedMegacube]);

  const loadFluxMap = (x, y) => {
    getFluxByPosition({ x, y, megacube: selectedMegacube }).then((res) => setFluxPlotData(res));
  };

  const loadSpaxel = (x, y) => {
    getSpaxelFitByPosition({ x, y, megacube: selectedMegacube })
      .then((res) => setSpaxelTableData(res));
  };

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      loadFluxMap(heatmapPoints[0], heatmapPoints[1]);
      loadSpaxel(heatmapPoints[0], heatmapPoints[1]);
    }
  }, [heatmapPoints]);

  useEffect(() => {
    if (selectedMegacube !== '' && selectedImage.id !== 0) {
      const heatmap = localHeatmaps.filter((el) => el.title === selectedImage.name);
      if (heatmap.length > 0) {
        setHeatmapPlotImageData(heatmap[0]);
        const heatmapArr = [].concat.apply([], heatmap[0].z);
        setHeatmapValueLimits([Math.min(...heatmapArr), Math.max(...heatmapArr)]);
        setHeatmapColorRangeValue([Math.min(...heatmapArr), Math.max(...heatmapArr)]);
        setHeatmapError('');
      } else {
        getImageHeatmap({ megacube: selectedMegacube, hud: selectedImage.name })
          .then((res) => {
            setHeatmapPlotImageData(res);
            setHeatmapError('');
          })
          .catch((err) => {
            // If heatmap couldn't be built, present an error message to the user:
            setHeatmapError(err.message);
            setFluxPlotData({});
            setSpaxelTableData({});
            setHeatmapPoints([0, 0]);
            setHeatmapValueLimits([]);
            setHeatmapColorRangeValue([]);
          });
      }
    }
  }, [selectedMegacube, selectedImage, localHeatmaps]);

  useEffect(() => {
    if (selectedMegacube !== '' && selectedContour.id !== 0) {
      const heatmap = localHeatmaps.filter((el) => el.title === selectedContour.name);
      if (heatmap.length > 0) {
        setHeatmapPlotContourData(heatmap[0]);
        setHeatmapError('');
      } else {
        getImageHeatmap({ megacube: selectedMegacube, hud: selectedContour.name })
          .then((res) => {
            setHeatmapPlotContourData(res);
            setHeatmapError('');
          })
          .catch((err) => {
            // If heatmap couldn't be built, present an error message to the user:
            setHeatmapError(err.message);
          });
      }
    }
  }, [selectedMegacube, selectedContour, localHeatmaps]);

  useEffect(() => {
    if (spaxelTableData.rows && spaxelTableData.rows.length > 0) {
      spaxelTableData.rows.map((row) => ({
        [spaxelTableData.columns[0]]: row[0],
        [spaxelTableData.columns[1]]: row[1],
        [spaxelTableData.columns[2]]: row[2],
        [spaxelTableData.columns[3]]: row[3],
      }));
    }
  }, [spaxelTableData]);

  const handleSelectMegacube = (e) => {
    setSelectedMegacube(e.target.value);
  };

  const handleSelectImage = (e) => {
    setHeatmapPoints([0, 0]);
    setFluxPlotData({});
    setSpaxelTableData({});
    setSelectedImage({
      id: e.target.value,
      name: hudList[e.target.value - 1].name,
    });
    setHeatmapSliderValue(e.target.value);
  };

  const handleSelectContour = (e) => {
    setSelectedContour({
      id: e.target.value,
      name: hudList[e.target.value - 1].name,
    });
  };

  const handleHeatmapClick = (e) => {
    setFluxPlotData({});
    setSpaxelTableData({});
    setHeatmapPoints([e.points[0].x, e.points[0].y]);
  };

  const handleHeatmapSliderChange = (e, value) => {
    if (value !== selectedImage.id) {
      setHeatmapSliderValue(value);
    }
  };

  const handleHeatmapColorRangeChange = (e, value) => {
    console.log(value);
    setHeatmapColorRangeValue(value);
  };

  const preloadHeatmaps = () => {
    hudList.forEach((hud) => {
      getImageHeatmap({ megacube: selectedMegacube, hud: hud.name })
        .then((res) => setLocalHeatmaps((localHeatmapsRef) => [...localHeatmapsRef, res]));
    });
  };

  useEffect(() => {
    if (hudList.length > 0) preloadHeatmaps();
  }, [hudList]);


  useEffect(() => {
    if (hudList.length > 0) {
      setSelectedImage({
        id: heatmapSliderValue,
        name: hudList[heatmapSliderValue - 1].name,
      });
    }
  }, [heatmapSliderValue, hudList]);

  const handlePlayClick = () => setIsPlaying(!isPlaying);

  useInterval(() => {
    if (heatmapSliderValue === hudList.length) {
      setHeatmapSliderValue(1);
    } else {
      setHeatmapSliderValue(heatmapSliderValue + 1);
    }
  }, isPlaying ? 1000 : null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader
                title={<span>Inputs</span>}
              />
              <CardContent>
                <form autoComplete="off">
                  <FormControl fullWidth>
                    <InputLabel htmlFor="input">Megacube</InputLabel>
                    <Select
                      value={selectedMegacube}
                      onChange={handleSelectMegacube}
                    >
                      {megacubeList.map((megacube) => (
                        <MenuItem
                          key={megacube}
                          value={megacube}
                        >
                          {megacube}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader
                title="Galaxy"
              />
              <SizeMe monitorHeight>
                {({ size }) => {
                  setHeatmapSize(size);
                  return (
                    <CardContent>
                      {selectedImage.id === 0 ? (
                        <Skeleton height={size && size.height ? size.height - 2 : 0} />
                      ) : (
                        <Grid container spacing={2} className={classes.animateEnter}>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <form autoComplete="off">
                                  <FormControl fullWidth className={classes.textAlignLeft}>
                                    <InputLabel htmlFor="input">Image</InputLabel>
                                    <Select
                                      value={selectedImage.id}
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
                          </Grid>
                          <Grid item xs={12}>
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
                                  hoverinfo: 'x+y',
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
                                  hoverinfo: 'x+y',
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
                                  hoverinfo: 'x+y',
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
                                  hoverinfo: 'x+y',
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
                                  hoverinfo: 'x+y',
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
                                width: size && size.width ? size.width - 50 : 0,
                                height: size && size.width ? size.width - 50 : 0,
                                title: selectedImage.name,
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
                                right: 10,
                                top: 191,
                                maxHeight: heatmapSize.height - 369,
                              }}
                              orientation="vertical"
                              aria-label="Heatmap Color Range"
                              max={heatmapValueLimits[1]}
                              min={heatmapValueLimits[0]}
                              value={heatmapColorRangeValue}
                              valueLabelDisplay="off"
                              className={classes.colorRange}
                              onChange={handleHeatmapColorRangeChange}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <HeatmapSlider
                              aria-label="Heatmap Slider"
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
                                aria-describedby="client-snackbar"
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
                      )}
                    </CardContent>
                  );
                }}
              </SizeMe>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card>
              <CardHeader
                title="Spectre"
              />
              <CardContent>
                {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 ? (
                  <div className={classes.animateEnter}>
                    <Plot
                      data={[
                        {
                          x: fluxPlotData.lamb,
                          y: fluxPlotData.flux,
                          name: 'Flux',
                        },
                        {
                          x: fluxPlotData.lamb,
                          y: fluxPlotData.synt,
                          name: 'Synt',
                        },
                      ]}
                      className={classes.plotWrapper}
                      layout={{
                        hovermode: 'closest',
                        autosize: true,
                        height: heatmapSize && heatmapSize.height ? heatmapSize.height - 40 : 0,
                        title: `x=${heatmapPoints[0]}, y=${heatmapPoints[1]}`,
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
                  </div>
                ) : (
                  <Skeleton height={heatmapSize && heatmapSize.height ? heatmapSize.height - 40 : 0} />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader
                title={spaxelTableData.title ? spaxelTableData.title : 'Best fit for Spaxel'}
              />
              <CardContent className={classes.cardContentTable}>
                {spaxelTableData.rows && spaxelTableData.rows.length > 0 ? (
                  <div className={classes.animateEnter}>
                    <CustomTable
                      columns={spaxelTableData.columns.map((column) => ({ name: column, title: column, width: 320 }))}
                      data={
                        spaxelTableData.rows.map((row) => ({
                          [spaxelTableData.columns[0]]: row[0],
                          [spaxelTableData.columns[1]]: row[1],
                          [spaxelTableData.columns[2]]: row[2],
                          [spaxelTableData.columns[3]]: row[3],
                        }))
                      }
                      hasPagination={false}
                      totalCount={spaxelTableData.count}
                      remote={false}
                      hasColumnVisibility={false}
                    />
                  </div>
                ) : (
                  <>
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                    <Skeleton className={classes.skeletonMargin} />
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

Verifier.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default Verifier;
