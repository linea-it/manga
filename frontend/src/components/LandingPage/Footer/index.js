import React from 'react';
import { Typography, Grid } from '@mui/material';
import logo from '../../../assets/img/linea-dark-invert.png';
import useStyles from './styles';
import { APP_VERSION } from '../../../services/api';
function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className={classes.container}
      >
        <Grid item>
          {APP_VERSION !== undefined && (
            <Typography
              variant="body"
              pl={2}
              color="primary.contrastText"
              sx={{
                // color: "inherit",
                fontSize: "0.75em",
              }}
              >
              v{APP_VERSION}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <Typography color="inherit" className={classes.marginItem}>
            <span className={classes.poweredBy}>Powered by</span>
            <a
              href="http://www.linea.org.br/"
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
