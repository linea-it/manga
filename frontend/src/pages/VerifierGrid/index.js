import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import { getHudList, getImageHeatmap } from '../../services/api';

const useStyles = makeStyles((theme) => ({
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
}));

function VerifierGrid({ setTitle }) {
  const { megacube } = useParams();
  const Plot = createPlotlyComponent(Plotly);
  const classes = useStyles();
  const [hudList, setHudList] = useState([]);
  const [localHeatmaps, setLocalHeatmaps] = useState([]);

  useEffect(() => {
    setTitle('Verifier Grid');
  }, [setTitle]);


  useEffect(() => {
    getHudList({ megacube }).then((res) => setHudList(res));
  }, []);

  useEffect(() => {
    if (hudList.length > 0) {
      hudList.forEach((hud) => {
        getImageHeatmap({ megacube, hud: hud.name })
          .then((res) => setLocalHeatmaps((localHeatmapsRef) => [...localHeatmapsRef, res]))
          .catch((err) => {
            setLocalHeatmaps((localHeatmapsRef) => [...localHeatmapsRef, {
              title: hud.display_name,
              error: err.message,
            }]);
          });
      });
    }
  }, [hudList]);

  // Function that will check the current length of localHeatmaps
  // in comparison with hudList and display the leftovers as skeletons:
  const leftoverSkeletons = () => {
    const skeletons = [];
    for (let i = hudList.length; i > localHeatmaps.length; i--) {
      skeletons.push(
        <Grid key={i} item xs={12} md={4}>
          <Skeleton width={400} height={400} className={classes.skeletonMargin} />
        </Grid>,
      );
    }
    return skeletons;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader
                title="Verifier Grid"
              />
              <CardContent>
                <Grid container spacing={2}>
                  {localHeatmaps.length > 0
                    ? localHeatmaps.map((heatmap, i) => (
                      <Grid key={i} item xs={12} md={4} className={classes.animateEnter}>
                        <Plot
                          data={[{
                            z: heatmap.error ? [] : heatmap.z,
                            type: 'heatmap',
                            colorscale: 'Viridis',
                          }]}
                          className={classes.plotWrapper}
                          layout={{
                            hovermode: 'closest',
                            width: 400,
                            height: 400,
                            title: heatmap.title,
                            yaxis: {
                              scaleanchor: 'x',
                            },
                          }}
                          config={{
                            scrollZoom: false,
                            displaylogo: false,
                            responsive: true,
                            displayModeBar: false,
                          }}
                          transition={{
                            duration: 300,
                            easing: 'cubic-in-out',
                          }}
                          frame={{ duration: 300 }}
                        />
                      </Grid>
                    )) : (
                      <Grid container spacing={2}>
                        {[0, 0, 0, 0, 0, 0].map(() => (
                          <Grid item xs={12} md={4}>
                            <Skeleton width={400} height={400} className={classes.skeletonMargin} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  {leftoverSkeletons()}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default VerifierGrid;
