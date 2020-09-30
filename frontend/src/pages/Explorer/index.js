import React, { useState, useEffect } from 'react';
import {
  Grid, Button, Icon, Typography,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import useInterval from '../../hooks/useInterval';
import {
  getFluxByPosition,
  getHudList,
  getImageHeatmap,
  getLogAgeByPosition,
  getVecsByPosition,
  getHeader
} from '../../services/api';
import VerifierGrid from '../../components/VerifierGrid';
import Galaxy from '../../components/Galaxy';
import Spectre from '../../components/Spectre';
import Switch from '../../components/Switch';
import { mergeArrayOfArrays } from '../../services/utils';
import MegacubeHeader from '../../components/MegacubeHeader';

function Explorer() {
  const { id } = useParams();
  const history = useHistory();
  const [hudList, setHudList] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState({
    id: 0,
    name: '',
  });
  const [selectedContour, setSelectedContour] = useState({
    id: 0,
    name: '',
  });
  const [fluxPlotData, setFluxPlotData] = useState({});
  const [heatmapPlotImageData, setHeatmapPlotImageData] = useState({ z: [], title: '' });
  const [heatmapPlotContourData, setHeatmapPlotContourData] = useState({});
  const [heatmapError, setHeatmapError] = useState('');
  const [heatmapPoints, setHeatmapPoints] = useState([0, 0]);
  const [heatmapSliderValue, setHeatmapSliderValue] = useState(1);
  const [heatmapValueLimits, setHeatmapValueLimits] = useState([]);
  const [heatmapColorRangeValue, setHeatmapColorRangeValue] = useState([]);
  const [heatmapContourLimits, setHeatmapContourLimits] = useState([]);
  const [heatmapContourRange, setHeatmapContourRange] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localHeatmaps, setLocalHeatmaps] = useState([]);
  const [heatmapSize, setHeatmapSize] = useState({ height: 450 });
  const [isGrid, setIsGrid] = useState(false);
  const [header, setHeader] = useState([]);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [agePlotData, setAgePlotData] = useState({
    x: [],
    y: [],
    m: [],
  });
  const [vecsPlotData, setVecsPlotData] = useState({
    x: [],
    y: [],
    m: [],
    mlegend: [],
  });

  useEffect(() => {
    getHudList(id).then((res) => {
      setDownloadUrl(res.download)
      setHudList(res.hud)
    });
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
    getFluxByPosition({ x, y, id }).then((res) => setFluxPlotData(res));
  };

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      loadFluxMap(heatmapPoints[0], heatmapPoints[1]);
    }
  }, [heatmapPoints]);

  useEffect(() => {
    if (selectedImage.id !== 0) {
      const heatmap = localHeatmaps.filter((el) => el.title === selectedImage.name);
      if (heatmap.length > 0) {
        setHeatmapPlotImageData(heatmap[0]);
        const mergedHeatmapZ = mergeArrayOfArrays(heatmap[0].z);

        setHeatmapValueLimits([Math.min(...mergedHeatmapZ), Math.max(...mergedHeatmapZ)]);
        setHeatmapColorRangeValue([Math.min(...mergedHeatmapZ), Math.max(...mergedHeatmapZ)]);
        setHeatmapError('');
      } else {
        getImageHeatmap(id, selectedImage.name)
          .then((res) => {
            setHeatmapPlotImageData(res);
            setHeatmapError('');
          })
          .catch((err) => {
            // If heatmap couldn't be built, present an error message to the user:
            setHeatmapError(err.message);
            // setFluxPlotData({});
            // setHeatmapPoints([0, 0]);
            // setHeatmapValueLimits([]);
            // setHeatmapColorRangeValue([]);
          });
      }
    }
  }, [selectedImage, localHeatmaps]);

  useEffect(() => {
    if (selectedContour.id !== 0) {
      const heatmap = localHeatmaps.filter((el) => el.title === selectedContour.name);
      if (heatmap.length > 0) {
        setHeatmapPlotContourData(heatmap[0]);

        const heatmapArr = [].concat.apply([], heatmap[0].z);
        setHeatmapContourLimits([Math.min(...heatmapArr), Math.max(...heatmapArr)]);
        setHeatmapContourRange(Math.max(...heatmapArr));

        setHeatmapError('');
      } else {
        getImageHeatmap(id, selectedContour.name)
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
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      getLogAgeByPosition({
        id,
        x: heatmapPoints[0],
        y: heatmapPoints[1],
      }).then((res) => {
        setAgePlotData(res);
      });
    }
  }, [heatmapPoints, id]);

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      getVecsByPosition({
        id,
        x: heatmapPoints[0],
        y: heatmapPoints[1],
      }).then((res) => {
        setVecsPlotData(res);
      });
    }
  }, [heatmapPoints, id]);

  const handleSelectImage = (e) => {
    setHeatmapPoints([0, 0]);
    setFluxPlotData({});
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

  const handleHeatmapContourRangeChange = (e, value) => {
    setHeatmapContourRange(value);
  };


  const preloadHeatmaps = () => {
    hudList.forEach((hud) => {
      getImageHeatmap(id, hud.name)
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

  const handleBackNavigation = () => history.goBack();

  const handleHeaderClick = () => {
    getHeader(id)
      .then(res => {
        setHeader(res)
        setIsHeaderOpen(true);
      });
  }

  return (
    <Grid container spacing={2} style={{ padding: 16, maxWidth: '100%' }}>
      <Grid item xs={12}>
        <Grid container justify="space-between">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  title="Back"
                  onClick={handleBackNavigation}
                >
                  <Icon className="fas fa-undo" fontSize="inherit" />
                  <Typography variant="button" style={{ margin: '0 5px' }}>
                    Back
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  title="Download"
                  href={downloadUrl}
                >
                  <Icon className="fas fa-download" fontSize="inherit" />
                  <Typography variant="button" style={{ margin: '0 5px' }}>
                    Download
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  title="Header"
                  onClick={handleHeaderClick}
                >
                  <Icon className="fas fa-table" fontSize="inherit" />
                  <Typography variant="button" style={{ margin: '0 5px' }}>
                  Header
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Switch isGrid={isGrid} setIsGrid={setIsGrid} />
          </Grid>
        </Grid>
      </Grid>
      {isGrid ? (
        <Grid item xs={12}>
          <VerifierGrid megacube={id} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={6} xl={4}>
            <Galaxy
              setHeatmapSize={setHeatmapSize}
              selectedImage={selectedImage}
              handleSelectImage={handleSelectImage}
              selectedMegacube={id}
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
              heatmapContourLimits={heatmapContourLimits}
              heatmapContourRange={heatmapContourRange}
              handleHeatmapContourRangeChange={handleHeatmapContourRangeChange}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={8}>
            <Spectre
              heatmapPoints={heatmapPoints}
              fluxPlotData={fluxPlotData}
              heatmapSize={heatmapSize}
              selectedImage={selectedImage}
              vecsPlotData={vecsPlotData}
              agePlotData={agePlotData}
            />
          </Grid>
        </>
      )}
      <MegacubeHeader data={header} open={isHeaderOpen} setOpen={() => setIsHeaderOpen(false)} />
    </Grid>
  );
}

export default Explorer;
