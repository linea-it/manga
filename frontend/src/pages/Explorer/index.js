import React, { useState, useEffect } from 'react';
import { Grid, Button, Icon, Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import useInterval from '../../hooks/useInterval';
import {
  getFluxByPosition,
  getHudList,
  getAllImagesHeatmap,
  getLogAgeByPosition,
  getVecsByPosition,
  getHeader,
  getDownloadInfo,
} from '../../services/api';
import VerifierGrid from '../../components/VerifierGrid';
import Galaxy from '../../components/Galaxy';
import Spectre from '../../components/Spectre';
import Switch from '../../components/Switch';
import { mergeArrayOfArrays } from '../../services/utils';
import MegacubeHeader from '../../components/MegacubeHeader';
import MegacubeDownload from '../../components/MegacubeDownload';

function Explorer() {
  const { id } = useParams();
  const history = useHistory();
  const [hudList, setHudList] = useState([]);
  const [download, setDownload] = useState({
    open: false,
    mangaid: '',
    name: '',
    megacube: '',
    link: '',
    size: 0,
  });
  const [selectedImage, setSelectedImage] = useState({ id: 0, name: '' });
  const [selectedContour, setSelectedContour] = useState({ id: 0, name: '' });
  const [fluxPlotData, setFluxPlotData] = useState({});
  const [heatmapPlotImageData, setHeatmapPlotImageData] = useState({
    z: [],
    title: '',
  });
  const [heatmapPlotContourData, setHeatmapPlotContourData] = useState({});
  const [heatmapError, setHeatmapError] = useState('');
  const [heatmapPoints, setHeatmapPoints] = useState([0, 0]);
  const [heatmapSliderValue, setHeatmapSliderValue] = useState(1);
  const [heatmapValueLimits, setHeatmapValueLimits] = useState([]);
  const [heatmapColorRangeValue, setHeatmapColorRangeValue] = useState([]);
  const [heatmapContourLimits, setHeatmapContourLimits] = useState([]);
  const [heatmapContourRange, setHeatmapContourRange] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heatmaps, setHeatmaps] = useState([]);
  const [heatmapSize, setHeatmapSize] = useState({ height: 450 });
  const [isGrid, setIsGrid] = useState(false);
  const [header, setHeader] = useState({ open: false, data: [] });
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
  const [isLoadingFlux, setLoadingFlux] = React.useState(false)

  useEffect(() => {
    getHudList(id).then((res) => {
      setHudList(res.hud);
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
    setLoadingFlux(true)
    getFluxByPosition({ x, y, id })
      .then(res => {
        setLoadingFlux(false)
        setFluxPlotData(res)
      })
      .catch(res => {
        setLoadingFlux(false)
        if (res.response.status === 400) {
          // Tratamento para erro nos campos
          // catchFormError(res.response.data)
        }
        if (res.response.status === 500) {
          // catchFormError(res.response.data)
        }
      })
  };

  useEffect(() => {
    if (heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0) {
      loadFluxMap(heatmapPoints[0], heatmapPoints[1]);
    }
  }, [heatmapPoints]);

  useEffect(() => {
    if (heatmaps.length > 0 && selectedImage.id !== 0) {
      // Filter the list of heatmaps by the selected image title
      const heatmap = heatmaps.filter((el) => el.title === selectedImage.name);

      if (heatmap.length > 0) {
        setHeatmapPlotImageData(heatmap[0]);

        // Get array of arrays, "z" values on heatmap,
        // and merge them into a one-dimensional arrays
        const mergedHeatmapZ = mergeArrayOfArrays(heatmap[0].z);

        // Set the limits of the heatmap contrast controller based on the prior made array
        setHeatmapValueLimits([
          Math.min(...mergedHeatmapZ),
          Math.max(...mergedHeatmapZ),
        ]);

        // Set the maximum range for the heatmap contrast controller based on the prior made array
        setHeatmapColorRangeValue([
          Math.min(...mergedHeatmapZ),
          Math.max(...mergedHeatmapZ),
        ]);

        setHeatmapError('');
      } else {
        setHeatmapError('Not found!');
      }
    }
  }, [selectedImage, heatmaps]);

  useEffect(() => {
    if (heatmaps.length > 0 && selectedContour.id !== 0) {
      // Filter the list of heatmaps by the selected image title
      const heatmap = heatmaps.filter(
        (el) => el.title === selectedContour.name
      );

      if (heatmap.length > 0) {
        setHeatmapPlotContourData(heatmap[0]);

        // Get array of arrays, "z" values on heatmap,
        // and merge them into a one-dimensional arrays
        const mergedHeatmapZ = mergeArrayOfArrays(heatmap[0].z);

        // Set the limits of the contour based on the prior made array
        setHeatmapContourLimits([
          Math.min(...mergedHeatmapZ),
          Math.max(...mergedHeatmapZ),
        ]);

        // Set the maximum range for the contour based on the prior made array
        setHeatmapContourRange(Math.max(...mergedHeatmapZ));

        setHeatmapError('');
      } else {
        setHeatmapError('Not found!');
      }
    }
  }, [selectedContour, heatmaps]);

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

  useEffect(() => {
    if (hudList.length > 0) {
      getAllImagesHeatmap(id).then((res) => {
        setHeatmaps(res);
      });
    }
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

  const handleBackNavigation = () => history.goBack();

  const handleHeaderClick = () => {
    getHeader(id).then((res) => {
      setHeader({
        open: true,
        data: res,
      });
    });
  };

  const handleDownloadClick = () => {
    getDownloadInfo(id).then((res) => {
      setDownload({
        open: true,
        ...res,
      });
    });
  };

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
                  onClick={handleDownloadClick}
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
          <VerifierGrid megacube={id} heatmaps={heatmaps} hudList={hudList} />
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
              isLoading={isLoadingFlux}
            />
          </Grid>
        </>
      )}
      <MegacubeHeader
        open={header.open}
        data={header.data}
        setOpen={() => setHeader({ open: false, data: [] })}
      />
      <MegacubeDownload
        data={download}
        setOpen={() =>
          setDownload({
            open: false,
            mangaid: '',
            name: '',
            megacube: '',
            link: '',
            size: 0,
          })
        }
      />
    </Grid>
  );
}

export default Explorer;
