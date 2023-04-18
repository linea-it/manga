import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import logo from '../../../assets/img/linea-dark-invert.png';
import useStyles from './styles';

function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.container}
      >
        <Grid item>
          <Typography color="inherit" className={classes.marginItem}>
            <span className={classes.poweredBy}>Testing</span>{' '}
            <span className={classes.versionLink}>1.0.0</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="inherit" className={classes.marginItem}>
            <span className={classes.poweredBy}>Powered by</span>
            <a
              href="http://www.linea.gov.br/"
              target="blank"
              className={classes.logoLink}
            >
              <img
                src={logo}
                title="LIneA"
                alt="LineA"
                className={classes.logoFooter}
              />
            </a>
          </Typography>
        </Grid>
      </Grid>
    </footer>
  );
}
export default Footer;
