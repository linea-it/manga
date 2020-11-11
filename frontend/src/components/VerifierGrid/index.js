import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Plot from 'react-plotly.js';
import { getAllImagesHeatmap } from '../../services/api';

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
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  gridContainer: {
    padding: theme.spacing(2),
  },
}));

function VerifierGrid() {
  const { id } = useParams();
  const classes = useStyles();
  const [heatmaps, setHeatmaps] = useState([]);


  useEffect(() => {
    getAllImagesHeatmap(id)
      .then((res) => {
        setHeatmaps(res);
      })
      .catch((err) => {
        setHeatmaps([{
          error: err.message,
        }]);
      });
  }, []);

  return (
    <Grid container className={classes.gridContainer}>
      {heatmaps.length > 0
        ? heatmaps.map((heatmap, i) => (
          <Grid key={heatmap.title} item xs={12} sm={6} md={4} xl={3} className={classes.animateEnter}>
            <Plot
              data={[{
                z: heatmap.error ? [] : heatmap.z,
                type: 'heatmap',
                colorscale: 'Viridis',
                showscale: false,
              }]}
              className={classes.plotWrapper}
              layout={{
                hovermode: 'closest',
                title: heatmap.title,
                yaxis: {
                  scaleanchor: 'x',
                },
                margin: {
                  // l: 0,
                  // r: 0,
                  // t: 0,
                  b: 0,
                  pad: 0,
                  autoexpand: true,
                },
              }}
              config={{
                scrollZoom: false,
                displaylogo: false,
                responsive: true,
                displayModeBar: false,
                staticPlot: true,
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
            {Array(12).fill(0).map(() => (
              <Grid item xs={12} sm={6} md={4} xl={3}>
                <Skeleton variant="rect" width={400} height={400} className={classes.skeletonMargin} />
              </Grid>
            ))}
          </Grid>
        )}
    </Grid>
  );
}

export default VerifierGrid;
