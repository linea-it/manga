import React, { useState, useCallback, useEffect } from 'react';
import { Container, Section, Bar } from 'react-simple-resizer';
import { useParams } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import Table from '../../components/Table';
import { getMegacubesList } from '../../services/api';
import OriginalImage from '../../components/OriginalImage';
import useWindowSize from '../../hooks/useWindowSize';
import useStyles from './styles';

function Preview() {
  // !TODO: Integrate component content based upon the List ID.
  const { idList } = useParams();

  const classes = useStyles();
  const windowSize = useWindowSize();
  const [megacubes, setMegacubes] = useState({
    data: [],
    totalCount: 0,
  });
  const [selectedMegacube, setSelectedMegacube] = useState(null);
  const [sectionWidth, setSectionWidth] = useState(0);
  const [tableHeight, setTableHeight] = useState(0);

  const columns = [
    {
      name: 'id',
      title: 'ID',
      width: 100,
    },
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
      name: 'rating',
      title: 'Rating',
    },
    {
      name: 'reject',
      title: 'Reject',
    },
    {
      name: 'comments',
      title: 'Comments',
      width: 150,
    },
  ];

  const loadData = useCallback(() => {
    getMegacubesList().then((res) => setMegacubes({
      data: res.megacubes.map((megacube, i) => ({
        id: i + 1,
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

  useEffect(() => {
    const headerHeight = 55.97;
    const tableToolbarHeight = 64.99;
    const tablePager = 71.95;

    setTableHeight(windowSize.height - headerHeight - tableToolbarHeight - tablePager);
  }, [windowSize.height]);

  const handleSectionWidthChange = (size) => setSectionWidth(size);

  return (
    <Container>
      <Section>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          setSelectedGalaxy={setSelectedMegacube}
          pageSize={100}
          pageSizes={[100, 200, 300]}
          remote={false}
          height={tableHeight}
          isVirtualTable
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
