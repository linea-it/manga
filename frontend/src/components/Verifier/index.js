import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Grid from '@material-ui/core/Grid';
import useInterval from '../../hooks/useInterval';
import {
  getFluxByPosition,
  getHudList,
  getImageHeatmap,
  getSpaxelFitByPosition,
} from '../../services/api';
import Galaxy from '../Galaxy';
import Spectre from '../Spectre';
import Spaxel from '../Spaxel';
import useStyles from './styles';

function Verifier({ megacube }) {
  const classes = useStyles();
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

  const clearData = () => {
    setHudList([]);
    setSelectedImage({
      id: 0,
      name: '',
    });
    setSelectedContour({
      id: 0,
      name: '',
    });
    setFluxPlotData({});
    setSpaxelTableData({});
    setHeatmapPlotImageData({});
    setHeatmapPlotContourData({});
    setHeatmapError('');
    setHeatmapPoints([0, 0]);
    setHeatmapSliderValue(1);
    setHeatmapValueLimits([]);
    setHeatmapColorRangeValue([]);
    setIsPlaying(false);
    setLocalHeatmaps([]);
    setHeatmapSize({ height: 450 });
  };

  useEffect(() => {
    clearData();

    getHudList({ megacube }).then((res) => setHudList(res));
  }, [megacube]);

  useEffect(() => {
    if (hudList.length > 0) {
      setSelectedImage({
        id: 1,
        name: hudList[0].name,
      });
    }
  }, [hudList]);

  const loadFluxMap = (x, y) => {
    getFluxByPosition({ x, y, megacube }).then((res) => setFluxPlotData(res));
  };

  const loadSpaxel = (x, y) => {
    getSpaxelFitByPosition({ x, y, megacube }).then((res) =>
      setSpaxelTableData(res)
    );
  };

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      loadFluxMap(heatmapPoints[0], heatmapPoints[1]);
      loadSpaxel(heatmapPoints[0], heatmapPoints[1]);
    }
  }, [heatmapPoints]);

  useEffect(() => {
    if (selectedImage.id !== 0) {
      const heatmap = localHeatmaps.filter(
        (el) => el.title === selectedImage.name
      );
      if (heatmap.length > 0) {
        setHeatmapPlotImageData(heatmap[0]);
        const heatmapArr = [].concat.apply([], heatmap[0].z);
        setHeatmapValueLimits([
          Math.min(...heatmapArr),
          Math.max(...heatmapArr),
        ]);
        setHeatmapColorRangeValue([
          Math.min(...heatmapArr),
          Math.max(...heatmapArr),
        ]);
        setHeatmapError('');
      } else {
        getImageHeatmap({ megacube, hud: selectedImage.name })
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
  }, [selectedImage, localHeatmaps]);

  useEffect(() => {
    if (selectedContour.id !== 0) {
      const heatmap = localHeatmaps.filter(
        (el) => el.title === selectedContour.name
      );
      if (heatmap.length > 0) {
        setHeatmapPlotContourData(heatmap[0]);
        setHeatmapError('');
      } else {
        getImageHeatmap({ megacube, hud: selectedContour.name })
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
  }, [selectedContour, localHeatmaps]);

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
      getImageHeatmap({ megacube, hud: hud.name }).then((res) =>
        setLocalHeatmaps((localHeatmapsRef) => [...localHeatmapsRef, res])
      );
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

  useInterval(
    () => {
      if (heatmapSliderValue === hudList.length) {
        setHeatmapSliderValue(1);
      } else {
        setHeatmapSliderValue(heatmapSliderValue + 1);
      }
    },
    isPlaying ? 1000 : null
  );

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12}>
        <Galaxy
          setHeatmapSize={setHeatmapSize}
          selectedImage={selectedImage}
          handleSelectImage={handleSelectImage}
          selectedMegacube={megacube}
          hudList={hudList}
          handleSelectContour={handleSelectContour}
          heatmapError={heatmapError}
          heatmapPlotImageData={heatmapPlotImageData}
          heatmapPlotContourData={heatmapPlotContourData}
          heatmapColorRangeValue={heatmapColorRangeValue}
          heatmapPoints={heatmapPoints}
          selectedContour={selectedContour}
          handleHeatmapClick={handleHeatmapClick}
          heatmapSize={heatmapSize}
          heatmapValueLimits={heatmapValueLimits}
          handleHeatmapColorRangeChange={handleHeatmapColorRangeChange}
          heatmapSliderValue={heatmapSliderValue}
          handleHeatmapSliderChange={handleHeatmapSliderChange}
          handlePlayClick={handlePlayClick}
          isPlaying={isPlaying}
        />
      </Grid>
      <Grid item xs={12}>
        <Spectre
          heatmapPoints={heatmapPoints}
          fluxPlotData={fluxPlotData}
          heatmapSize={heatmapSize}
          selectedImage={selectedImage}
        />
      </Grid>

      <Grid item xs={12}>
        <Spaxel spaxelTableData={spaxelTableData} />
      </Grid>
    </Grid>
  );
}

Verifier.propTypes = {
  megacube: PropTypes.string.isRequired,
};

export default Verifier;
