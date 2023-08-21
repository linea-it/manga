import React from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { YouTube, Twitter, GitHub } from '@mui/icons-material';
import styles from './styles';

function Banner() {
  const classes = styles();

  const handlerClick = (socialMedia) => {
    let uri = '';
    switch (socialMedia) {
      case 'YouTube':
        uri = 'https://www.youtube.com/user/lineamcti';
        break;
      case 'Twitter':
        uri = 'https://twitter.com/LIneA_mcti';
        break;
      case 'GitHub':
        uri = 'https://github.com/linea-it/tno';
        break;
      default:
        uri = 'https://www.youtube.com/user/lineamcti';
    }
    window.open(uri, '_blank');
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        className={classes.container}
      >
        <Grid item xs={12} className={classes.titleWrapper}>
          <img
            src={`${process.env.PUBLIC_URL}/img/sdsslogowhite.png`}
            alt="Data Release Interface"
            className={classes.logo}
          />
          <h1 className={classes.title}>LIneA MaNGA Portal</h1>
        </Grid>
        {/* <Grid item xs={12}>
          <h2>Mapping Nearby Galaxies at APO</h2>
        </Grid> */}
      </Grid>
      <div className={classes.socialWrapper}>
        <IconButton
          onClick={() => {
            handlerClick('Youtube');
          }}
          color="inherit"
          aria-label="YouTube"
          component="span"
        >
          <YouTube />
        </IconButton>
        <IconButton
          onClick={() => {
            handlerClick('Twitter');
          }}
          color="inherit"
          aria-label="Twitter"
          component="span"
        >
          <Twitter />
        </IconButton>
        <IconButton
          onClick={() => {
            handlerClick('GitHub');
          }}
          color="inherit"
          aria-label="GitHub"
          component="span"
        >
          <GitHub />
        </IconButton>
      </div>
    </div>
  );
}

export default Banner;
