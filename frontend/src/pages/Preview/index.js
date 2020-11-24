import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Container, Section, Bar } from 'react-simple-resizer';
import { Grid, Button } from '@material-ui/core';
import Table from '../../components/Table';
import { getMegacubesList, getOriginalImageHeatmap } from '../../services/api';
import OriginalImage from '../../components/OriginalImage';
import useWindowSize from '../../hooks/useWindowSize';
import useStyles from './styles';

function Preview() {
  const history = useHistory();
  const classes = useStyles();
  const windowSize = useWindowSize();
  const [megacubes, setMegacubes] = useState({
    data: [],
    totalCount: 0,
  });
  const [sectionWidth, setSectionWidth] = useState(0);
  const [originalImageData, setOriginalImageData] = useState([]);
  const [tableHeight, setTableHeight] = useState(0);


  const memorizedSelections = localStorage.getItem('previewSelections');

  const [selectedMegacube, setSelectedMegacube] = useState(memorizedSelections ? JSON.parse(memorizedSelections).selectedMegacube : null);
  const [tableOptions, setTableOptions] = useState(memorizedSelections ? {
    sorting: JSON.parse(memorizedSelections).sorting,
    pageSize: JSON.parse(memorizedSelections).pageSize,
    currentPage: JSON.parse(memorizedSelections).currentPage,
    searchValue: JSON.parse(memorizedSelections).searchValue,
    selection: JSON.parse(memorizedSelections).selection
  } : {
    sorting: [],
    pageSize: 20,
    currentPage: 0,
    searchValue: '',
    selection: [],
  })

  const columns = [
    {
      name: 'index',
      title: ' ',
      width: 80,
      sortingEnabled: false,
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
      width: 80
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
    selection
   }) => {

    setTableOptions({
      sorting,
      pageSize,
      currentPage,
      searchValue,
      selection
    })

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
    setOriginalImageData([])
    if(selectedMegacube) {
      getOriginalImageHeatmap(selectedMegacube)
        .then(res => {
          setOriginalImageData(res)
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

  const handleExplorerClick = () => {

    // Store last submitted period on local storage:
    localStorage.setItem(
      'previewSelections',
      JSON.stringify({
        ...tableOptions,
        selectedMegacube
      })
    );

    history.push(`/explorer/${selectedMegacube}`)
  }

  return (
    <Container>
      <Section>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          setSelectedRow={setSelectedMegacube}
          defaultSearchValue={tableOptions.searchValue}
          defaultCurrentPage={tableOptions.currentPage}
          defaultSelection={tableOptions.selection}
          pageSize={tableOptions.pageSize}
          pageSizes={[20, 50, 100]}
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
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedMegacube}
              onClick={handleExplorerClick}
            >
              Explorer
            </Button>
          </Grid>
        </Grid>
        {'z' in originalImageData ? <OriginalImage data={originalImageData} sectionWidth={sectionWidth} /> : null}
      </Section>
    </Container>
  );
}

export default Preview;
