import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Grid, Typography } from '@material-ui/core';
import Plot from 'react-plotly.js';

const useStyles = makeStyles((theme) => ({
  animateEnter: {
    animation: 'fadein 1s',
    padding: '0 16px',
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

function VerifierGrid({ heatmaps, hudList }) {
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer} justify="center">
      {heatmaps.length > 0
        ? heatmaps.map((heatmap) => (
            <Grid
              key={heatmap.title}
              item
              xs={12}
              sm={6}
              md={4}
              xl={3}
              className={classes.animateEnter}
            >
              <Typography variant="h6" align="center">
                {heatmap.title}
              </Typography>
              <Typography variant="subtitle1" align="center">
                (
                {
                  hudList
                    .filter((hud) => hud.name === heatmap.title)[0]
                    .comment.split(' (')[0]
                }
                )
              </Typography>
              <Plot
                data={[
                  {
                    z: heatmap.error ? [] : heatmap.z,
                    type: 'heatmap',
                    colorscale: 'Viridis',
                    showscale: true,
                  },
                ]}
                layout={{
                  hovermode: 'closest',
                  yaxis: {
                    scaleanchor: 'x',
                  },
                  margin: {
                    t: 0,
                    b: 40,
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
          ))
        : null}
    </Grid>
  );
}

VerifierGrid.propTypes = {
  heatmaps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      z: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      error: PropTypes.string,
    })
  ).isRequired,
  hudList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      display_name: PropTypes.string,
      comment: PropTypes.string,
    })
  ).isRequired,
};

export default VerifierGrid;
