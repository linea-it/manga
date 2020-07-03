import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import useInterval from '../../hooks/useInterval';
import {
  getFluxByPosition,
  getHudList,
  getImageHeatmap,
  getSpaxelFitByPosition,
} from '../../services/api';
import VerifierGrid from '../../components/VerifierGrid';
import Galaxy from '../../components/Galaxy';
import Spectre from '../../components/Spectre';
import Spaxel from '../../components/Spaxel';
import Switch from '../../components/Switch';

function Explorer() {
  const { megacube } = useParams();
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
  const [isGrid, setIsGrid] = useState(false);

  useEffect(() => {
    getHudList({ megacube }).then((res) => setHudList(res));
  }, []);

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
    getSpaxelFitByPosition({ x, y, megacube })
      .then((res) => setSpaxelTableData(res));
  };

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      loadFluxMap(heatmapPoints[0], heatmapPoints[1]);
      loadSpaxel(heatmapPoints[0], heatmapPoints[1]);
    }
  }, [heatmapPoints]);

  useEffect(() => {
    if (selectedImage.id !== 0) {
      const heatmap = localHeatmaps.filter((el) => el.title === selectedImage.name);
      if (heatmap.length > 0) {
        setHeatmapPlotImageData(heatmap[0]);
        const heatmapArr = [].concat.apply([], heatmap[0].z);
        setHeatmapValueLimits([Math.min(...heatmapArr), Math.max(...heatmapArr)]);
        setHeatmapColorRangeValue([Math.min(...heatmapArr), Math.max(...heatmapArr)]);
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
      const heatmap = localHeatmaps.filter((el) => el.title === selectedContour.name);
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
      getImageHeatmap({ megacube, hud: hud.name })
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
    <Grid container spacing={2} style={{ padding: 16 }}>
      <Grid item xs={12}>
        <Grid container justify="flex-end">
          <Grid item>
            <Switch isGrid={isGrid} setIsGrid={setIsGrid} />
          </Grid>
        </Grid>
      </Grid>
      {isGrid ? (
        <Grid item xs={12}>
          <VerifierGrid megacube={megacube} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={6} xl={4}>
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
          <Grid item xs={12} md={6} xl={8}>
            <Spectre
              heatmapPoints={heatmapPoints}
              fluxPlotData={fluxPlotData}
              heatmapSize={heatmapSize}
              selectedImage={selectedImage}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Space dedicated to future histograms */}
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Space dedicated to future histograms */}
          </Grid>
          <Grid item xs={12}>
            <Spaxel spaxelTableData={spaxelTableData} />
          </Grid>
        </>
      )}

    </Grid>
  );
}

export default Explorer;
