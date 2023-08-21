/* eslint-disable max-len */
import React, { useState, useEffect, useMemo  } from 'react';
import YouTube from 'react-youtube';
import {
  Container,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  Card,
  CardContent
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from './styles';

function Tutorials() {
  const classes = styles();
  const opts = { width: '100%' };
  const [idPlayer, setIdPlayer] = useState('');
  const [videoOnDisplay, setVideoOnDisplay] = useState({
    tutorial: '',
    video: '',
  });
const treeTutorial = useMemo(() => [
  {
    id: 1,
    title: 'Overview',
    videos: [
      {
        title: 'Overview',
        idVideo: 'nuPe8Ouo2oA',
      },
    ],
  },
], []);
  // const treeTutorial = 

  const [expanded, setExpanded] = React.useState('');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleSelected = (tutorial, video) => {
    setIdPlayer(video.idVideo);
    setVideoOnDisplay({ tutorial: tutorial.title, video: video.title });
  };

  useEffect(() => {
    handleSelected(treeTutorial[0], treeTutorial[0].videos[0]);
  }, [treeTutorial]);

  return (
    <div className={classes.initContainer}>
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="textPrimary">Tutorials</Typography>
        </Breadcrumbs>
        <Grid
          container
          spacing={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
          className={classes.root}
        >
          <Grid item xs={12} sm={4}>
            {treeTutorial.map((tutorial, index) => (
              <Accordion
                key={tutorial.id}
                square
                expanded={expanded === `panel${index + 1}`}
                onChange={handleChange(`panel${index + 1}`)}
              >
                <AccordionSummary
                  aria-controls={`panel${index + 1}d-content`}
                  id={`panel${index + 1}d-header`}
                >
                  {expanded === `panel${index + 1}` ? (
                    <ArrowDropDownIcon />
                  ) : (
                    <ArrowRightIcon />
                  )}
                  <Typography>{tutorial.title}</Typography>
                </AccordionSummary>
                {tutorial.videos.map((video) => (
                  <ListItem
                    key={video.idVideo}
                    className={classes.item}
                    onClick={() => {
                      handleSelected(tutorial, video);
                    }}
                  >
                    <ListItemIcon>
                      <MovieIcon />
                    </ListItemIcon>
                    <ListItemText primary={video.title} />
                  </ListItem>
                ))}
              </Accordion>
            ))}
          </Grid>
          <Grid item xs={12} sm={8}>
            {idPlayer !== '0' ? (
              <>
                <YouTube videoId={idPlayer} opts={opts} />
                <Typography variant="subtitle1" align="center" gutterBottom>
                  {`${videoOnDisplay.tutorial} - ${videoOnDisplay.video}`}
                </Typography>
              </>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
        <Card>
          <CardContent>
            <Typography variant="h6">Download Instructions</Typography>
            <Typography variant="body1">
              <p>If you want to download a single datacube, follow these steps:</p>
              <pre className={classes.codeBlock}>
                <code>
                  wget https://manga.linea.org.br/data/manga-10001-12701-MEGACUBE.fits.tar.bz2
                </code>
              </pre>
              <p>If you have a list of datacubes to download, save the URLs in a file named e.g. <strong>download.txt</strong>:</p>
              <pre className={classes.codeBlock}>
                <code>
                  https://manga.linea.org.br/data/manga-10001-12701-MEGACUBE.fits.tar.bz2
                  {'\n'}
                  https://manga.linea.org.br/data/manga-10001-6104-MEGACUBE.fits.tar.bz2
                  </code>
              </pre>
              <p>Then, use the following command to download the datacubes:</p>
              <pre className={classes.codeBlock}>
                <code>
                  wget -i download.txt
                </code>
              </pre>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Tutorials;
