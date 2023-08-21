import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button, Icon, Typography, CardContent, Card, CardHeader,Box } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import useInterval from '../../hooks/useInterval';
import {
  getGalaxyById,
  getHudList,
  getAllImagesHeatmap,
  getLogAgeByPosition,
  getVecsByPosition,
  getHeader,
  getDownloadInfo,
} from '../../services/api';
import VerifierGrid from '../../components/VerifierGrid';
import Galaxy from '../../components/Galaxy';
import Switch from '../../components/Switch';
import { mergeArrayOfArrays } from '../../services/utils';
import MegacubeHeader from '../../components/MegacubeHeader';
import MegacubeDownload from '../../components/MegacubeDownload';
import SpectrumPlot from '../../components/Spectre/Plot';
import Age from '../../components/Plot/Age';
import Vecs from '../../components/Plot/Vecs';
import { useQuery } from 'react-query'

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
  const [galaxy, setGalaxy] = useState(undefined);
  const [error, setError] = React.useState(null)
  const [selectedImage, setSelectedImage] = useState({ id: 0, name: '' });
  const [selectedContour, setSelectedContour] = useState({ id: 0, name: '' });
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
  
  // TODO: Dar uma olhada nisso
  // https://tkdodo.eu/blog/use-state-for-one-time-initializations#state-to-the-rescue
  const { status, isLoading } = useQuery({
    queryKey: ['galaxyById', { id }],
    queryFn: getGalaxyById,
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: false,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 1 * 60 * 60 * 1000,
    staleTime: 1 * 60 * 60 * 1000,
    retry: 1,

    onSuccess: data => {
      if (!data) {
        return
      }
      console.log("Loaded Galaxy:", data)
      setGalaxy(data)
    },
    onError: error => {
      let msg = error.message
      if (error.response) {
        msg = error.response.data.message
      }
      setError(msg)
    }
  })

  if (galaxy === undefined) return (
    <div>Galaxy undefined</div>
  )

  // const loadGalaxyById = useCallback(async () => {
  //   setIsLoading(true)
  //   console.log("loadGalaxyId: ", id)
  //   // getProduct(productId)
  //   //   .then(res => {
  //   //     setProduct(res)
  //   //     setLoading(false)
  //   //   })
  //   //   .catch(res => {
  //   //     setLoading(false)
  //   //     if (res.response.status === 500) {
  //   //       // TODO: Tratar erro
  //   //       setNotFound(true)
  //   //     }
  //   //   })
  // }, [id])

  // React.useEffect(() => {
  //   loadGalaxyById()
  // }, [loadGalaxyById, id])

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
    // setFluxPlotData({});
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

  // if (selectedImage.id === 0) return null

  return (
    <Box>
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
    </Grid>
    <Grid
      container
      spacing={2}
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
    >      
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
            <Card>
              <CardHeader title='Spectrum and Histograms' />
              <CardContent style={{minHeight: '40vw'}}>
                {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 && (
                  <SpectrumPlot id={id} x={heatmapPoints[0]} y={heatmapPoints[1]} height={heatmapSize.height} />
                )}
              </CardContent>
            </Card>
          </Grid>                  
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Stellar Population Vectors' />
              <CardContent style={{minHeight: '20vw'}}>
                  {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 && (
                    <Age data={agePlotData} height={heatmapSize.height} />
                  )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Bined Population Vectors' />
              <CardContent style={{minHeight: '20vw'}}>
                  {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 && (
                    <Vecs data={vecsPlotData} height={heatmapSize.height} />
                  )}
              </CardContent>
            </Card>
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
    </Box>
  );
}

export default Explorer;
