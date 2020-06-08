import React, { useState, useCallback, useEffect } from 'react';
import { Container, Section, Bar } from 'react-simple-resizer';
import { useParams } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import Table from '../../components/Table';
import { getMegacubesList } from '../../services/api';
import OriginalImage from '../../components/OriginalImage';
import useStyles from './styles';

function Preview() {
  // !TODO: Integrate component content based upon the List ID.
  const { idList } = useParams();

  const classes = useStyles();
  const [megacubes, setMegacubes] = useState({
    data: [],
    totalCount: 0,
  });
  const [selectedMegacube, setSelectedMegacube] = useState(null);
  const [sectionWidth, setSectionWidth] = useState(0);

  const columns = [
    {
      name: 'galaxy_name',
      title: 'Galaxy',
      width: 220,
    },
    {
      name: 'type',
      title: 'Type',
      width: 80,
    },
    {
      name: 'ra',
      title: 'RA',
      width: 70,
    },
    {
      name: 'dec',
      title: 'Dec',
      width: 70,
    },
    {
      name: 'cube_name',
      title: 'Cube',
      width: 220,
    },
  ];

  const loadData = useCallback(() => {
    getMegacubesList().then((res) => setMegacubes({
      data: res.megacubes.map((megacube) => ({
        ra: 0,
        dec: 0,
        type: null,
        galaxy_name: megacube,
        cube_name: megacube.split('.fits')[0],
        verifier: megacube,
        grid: megacube,
      })),
      totalCount: res.count,
    }));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSectionWidthChange = (size) => setSectionWidth(size);


  return (
    <Container className={classes.container}>
      <Section>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          setSelectedGalaxy={setSelectedMegacube}
          remote={false}
        />
      </Section>
      <Bar
        className={classes.resizeBar}
        size={3}
      />
      <Section className={classes.imageSection} onSizeChanged={handleSectionWidthChange}>
        <Grid container spacing={2} direction="column" alignItems="flex-end">
          <Grid item>
            <Button variant="contained" color="primary" disabled={!selectedMegacube} href={`/explorer/${selectedMegacube}`}>Explorer</Button>
          </Grid>
        </Grid>
        <OriginalImage megacube={selectedMegacube} sectionWidth={sectionWidth} />
      </Section>
    </Container>
  );
}

export default Preview;
