import React, { useState, useCallback, useEffect } from 'react';
import { Container, Section, Bar } from 'react-simple-resizer';
import { useParams } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import Table from '../../components/Table';
import { getMegacubesList, getOriginalImageHeatmap } from '../../services/api';
import OriginalImage from '../../components/OriginalImage';
import useWindowSize from '../../hooks/useWindowSize';
import useStyles from './styles';

function Preview() {
  // !TODO: Integrate component content based upon the List ID.
  // const { idList } = useParams();

  const classes = useStyles();
  const windowSize = useWindowSize();
  const [megacubes, setMegacubes] = useState({
    data: [],
    totalCount: 0,
  });
  const [selectedMegacube, setSelectedMegacube] = useState(null);
  const [sectionWidth, setSectionWidth] = useState(0);
  const [originalImageData, setOriginalImageData] = useState([]);
  const [tableHeight, setTableHeight] = useState(0);

  const columns = [
    {
      name: 'id',
      title: '#',
      width: 80,
    },
    {
      name: 'nsa_iauname',
      title: 'Name',
      width: 180,
    },
    {
      name: 'objra',
      title: 'RA',
    },
    {
      name: 'objdec',
      title: 'Dec',
    },
    {
      name: 'mangaid',
      title: 'MaNGA-ID',
    },
    {
      name: 'mjdmed',
      title: 'MJD',
    },
    {
      name: 'exptime',
      title: 'Exp Time',
    },
    {
      name: 'airmsmed',
      title: 'Airmass',
    },
    {
      name: 'seemed',
      title: 'Seeing',
    },
    {
      name: 'nsa_z',
      title: 'z',
    },
    // {
    //   name: 'nsa_sersic_absmag',
    //   title: 'Abs Magnitude (Sersic)',
    //   width: 180,
    // },
    // {
    //   name: 'nsa_elpetro_absmag',
    //   title: 'Abs Mag (Petrosian)',
    //   width: 180,
    // },
    // {
    //   name: 'rating',
    //   title: 'Rating',
    //   sortingEnabled: false,
    // },
    // {
    //   name: 'reject',
    //   title: 'Reject',
    //   sortingEnabled: false,
    // },
    // {
    //   name: 'comments',
    //   title: 'Comments',
    //   width: 150,
    //   sortingEnabled: false,
    // },
  ];

  const loadData = ({
    sorting,
    pageSize,
    currentPage,
    searchValue,
   }) => {
    getMegacubesList({
      ordering: sorting,
      pageSize,
      page: currentPage + 1,
      search: searchValue,
    })
      .then(res => {
        setMegacubes({
          data: res.results,
          totalCount: res.count
        });
      });
  }

  useEffect(() => {
    if(selectedMegacube) {
      getOriginalImageHeatmap(selectedMegacube)
        .then(res => {
          setOriginalImageData(res.z)
        })
    }
  }, [selectedMegacube])

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
          setSelectedRow={setSelectedMegacube}
          pageSize={100}
          pageSizes={[100, 200, 300]}
          loadData={loadData}
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
        {originalImageData.length > 0 ? <OriginalImage data={originalImageData} sectionWidth={sectionWidth} /> : null}
      </Section>
    </Container>
  );
}

export default Preview;
