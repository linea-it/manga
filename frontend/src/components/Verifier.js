import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import {
  getFluxByPosition, getHudList, getImageHeatmap, getSpaxelFitByPosition,
} from '../api/Api';
import CustomTable from '../utils/CustomTable';

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
  gridWrapper: {
    marginBottom: theme.spacing(3),
  },
  imgResponsive: {
    maxWidth: '100%',
    width: 'auto',
  },
  iconHeader: {
    fontSize: '1rem',
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
  },
  skeletonMargin: {
    marginTop: '0.8em',
    marginBottom: '0.8em',
  },
  tableContainer: {
    marginTop: 15
  },
}));

function Verifier({ setTitle }) {
  const Plot = createPlotlyComponent(Plotly);
  const classes = useStyles();
  const [megacubeList, setMegacubeList] = useState(['manga-8138-6101-MEGA']);
  const [selectedMegacube, setSelectedMegacube] = useState(megacubeList[0]);
  const [hudList, setHudList] = useState([]);
  const [selectedHud, setSelectedHud] = useState('');
  const [fluxPlotData, setFluxPlotData] = useState({});
  const [spaxelTableData, setSpaxelTableData] = useState({});
  const [heatmapPlotData, setHeatmapPlotData] = useState({});
  const [heatmapPoints, setHeatmapPoints] = useState([0, 0]);

  useEffect(() => {
    setTitle('Verifier');
  }, [setTitle]);

  useEffect(() => {
    if(selectedMegacube !== '') {
      getHudList({ megacube: selectedMegacube }).then((res) => {
        setHudList(res)
        setSelectedHud(res[0].name)
      });
    }
  }, [selectedMegacube]);

  const loadFluxMap = (x, y) => {
    getFluxByPosition({ x, y, megacube: selectedMegacube }).then((res) => setFluxPlotData(res));
  };

  const loadSpaxel = (x, y) => {
    getSpaxelFitByPosition({ x, y, megacube: selectedMegacube }).then((res) => setSpaxelTableData(res));
  };

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      loadFluxMap(heatmapPoints[0], heatmapPoints[1]);
      loadSpaxel(heatmapPoints[0], heatmapPoints[1]);
    }
  }, [heatmapPoints]);

  useEffect(() => {
    if(selectedMegacube !== '' && selectedHud !== '') {
      getImageHeatmap({ megacube: selectedMegacube, hud: selectedHud })
        .then((res) => setHeatmapPlotData(res));
    }
  }, [selectedMegacube, selectedHud]);

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

  const handleSelectHud = (e) => {
    setHeatmapPoints([0, 0]);
    setFluxPlotData({});
    setSpaxelTableData({});
    setSelectedHud(e.target.value);
  };

  const handleHeatmapClick = (e) => {
    setFluxPlotData({});
    setSpaxelTableData({});
    setHeatmapPoints([e.points[0].x, e.points[0].y]);
  };


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} className={classes.gridWrapper}>
          <Card>
            <CardHeader
              title={<span>Inputs</span>}
            />
            <CardContent>
              <form autoComplete="off">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
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

                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="input">Hud</InputLabel>
                      <Select
                        value={selectedHud}
                        onChange={handleSelectHud}
                        disabled={selectedMegacube === ''}
                      >
                        {hudList.map((hud) => (
                          <MenuItem
                            key={hud.name}
                            value={hud.name}
                          >
                            {hud.display_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5} className={classes.block}>
          <Card>
            <CardHeader
              title="Plot"
            />
            <CardContent style={{ minHeight: 689 }}>
              {selectedHud === '' ? (
                <Skeleton height={650} />
              ) : (
                  <div className={classes.animateEnter}>

                    <Plot
                      data={[{
                        z: heatmapPlotData.z,
                        name: 'Image',
                        type: 'heatmap',
                        colorscale: 'Viridis',
                      }]}
                      className={classes.plotWrapper}
                      layout={{
                        hovermode: 'closest',
                        // autosize: true,
                        width: 600,
                        height: 600,
                        title: selectedHud,
                        yaxis: {
                          scaleanchor: 'x'
                        },
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
                  </div>
                )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7} className={classes.block}>
          <Card>
            <CardHeader
              title="Spectre"
            />
            <CardContent style={{ minHeight: 689 }}>
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
                        height: 600,
                        title: `x=${heatmapPoints[0]}, y=${heatmapPoints[1]}`
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
                <Skeleton height={650} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} className={classes.tableContainer}>
          <Card>
            <CardHeader
              title={spaxelTableData.title ? spaxelTableData.title : 'Best fit for Spaxel'}
            />
            <CardContent>
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
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

Verifier.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default Verifier;
