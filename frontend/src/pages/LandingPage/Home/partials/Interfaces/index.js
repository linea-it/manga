import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styles from './styles';
import { CardContent } from '@material-ui/core';

function Interfaces() {
  const classes = styles();
  const history = useHistory();

  const [interfaces] = useState([
    {
      id: '1',
      app_url: 'preview',
      app_display_name: 'IFU Viewer',
    },
  ]);

  const handleCardClick = (pathname) => history.push(pathname);

  return (
    <Container className={classes.minHeight}>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        {interfaces.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
            <Card className={classes.card}>
              <CardActionArea
                className={classes.cardAction}
                onClick={() => handleCardClick(item.app_url)}
              >
                <CardMedia
                  alt={item.app_display_name}
                  className={classes.media}
                  image={`${process.env.PUBLIC_URL}/img/card${item.id}.jpg`}
                  title={item.app_display_name}
                >
                  <Typography
                    gutterBottom
                    className={classes.titleItem}
                    variant="h5"
                    component="h2"
                  >
                    {item.app_display_name}
                  </Typography>
                </CardMedia>
                <CardContent>
                  Click the figure above to enter the portal.
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Interfaces;
