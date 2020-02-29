import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';
import { SizeMe } from 'react-sizeme';
import useInterval from '../../hooks/useInterval';
import styles from './styles';
import Table from '../../components/Table';
import {
  getFluxByPosition, getHudList, getImageHeatmap, getSpaxelFitByPosition, getMegacubesList,
} from '../../services/api';
import { HeatmapSlider, HeatmapColorRange } from '../../components/HeatmapSlider';
import Inputs from '../../components/Inputs';
import Galaxy from '../../components/Galaxy';

function Verifier() {
  const Plot = createPlotlyComponent(Plotly);
  const classes = styles();
  const [megacubeList, setMegacubeList] = useState([]);
  const [selectedMegacube, setSelectedMegacube] = useState('');
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
    getMegacubesList()
      .then((res) => {
        const filesWithoutExt = res.megacubes.map((megacube) => megacube.split('.fits')[0]);
        setMegacubeList(filesWithoutExt);
      });
  }, []);

  useEffect(() => {
    if (megacubeList.length > 0) {
      setSelectedMegacube(megacubeList[0]);
    }
  }, [megacubeList]);

  useEffect(() => {
    if (selectedMegacube !== '') {
      getHudList({ megacube: selectedMegacube }).then((res) => {
        setHudList(res);
      });
    }
  }, [selectedMegacube]);

  useEffect(() => {
    if (hudList.length > 0) {
      setSelectedImage({
        id: 1,
        name: hudList[0].name,
      });
    }
  }, [hudList]);

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
    setSelectedImage({
      id: 0,
      name: '',
    });
    setHudList([]);
    setLocalHeatmaps([]);
    setHeatmapPlotImageData({});
    setHeatmapPlotContourData({});
    setHeatmapError('');
    setHeatmapPoints([0, 0]);
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
        <Inputs
          selectedMegacube={selectedMegacube}
          handleSelectMegacube={handleSelectMegacube}
          megacubeList={megacubeList}
        />
      </Grid>

      <Grid item xs={12}>
        <Galaxy />
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
                    <Table
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

export default Verifier;
