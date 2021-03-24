import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

  const [selectedMegacube, setSelectedMegacube] = useState(
    memorizedSelections
      ? JSON.parse(memorizedSelections).selectedMegacube
      : null
  );
  const [tableOptions, setTableOptions] = useState(
    memorizedSelections
      ? {
          sorting: JSON.parse(memorizedSelections).sorting,
          pageSize: JSON.parse(memorizedSelections).pageSize,
          currentPage: JSON.parse(memorizedSelections).currentPage,
          searchValue: JSON.parse(memorizedSelections).searchValue,
          selection: JSON.parse(memorizedSelections).selection,
        }
      : {
          sorting: [],
          pageSize: 20,
          currentPage: 0,
          searchValue: '',
          selection: [],
        }
  );

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
      headerTooltip: 'IAU-style designation based on RA/Dec (NSA)',
    },
    {
      name: 'objra',
      title: 'RA',
      headerTooltip: 'Right ascension of the science object in J2000 (degrees)',
    },
    {
      name: 'objdec',
      title: 'Dec',
      headerTooltip: 'Declination of the science object in J2000 (degrees)',
    },
    {
      name: 'mangaid',
      title: 'MaNGA-ID',
    },
    {
      name: 'mjdmed',
      title: 'MJD',
      headerTooltip: 'Median MJD across all exposures',
    },
    {
      name: 'exptime',
      title: 'Exp Time',
      headerTooltip: 'Total exposure time (seconds)',
    },
    {
      name: 'airmsmed',
      title: 'Airmass',
      customElement: (row) => row.airmsmed.toFixed(2),
      headerTooltip: 'Median airmass across all exposures',
    },
    {
      name: 'seemed',
      title: 'Seeing',
      customElement: (row) => row.seemed.toFixed(2),
      headerTooltip: 'Median guider seeing (arcsec)',
    },
    {
      name: 'nsa_z',
      title: 'z',
      customElement: (row) => row.nsa_z.toFixed(2),
      width: 80,
      headerTooltip:
        'The targeting redshift (identical to nsa_z for those targets in the NSA Catalog. For others, it is the redshift provided by the Ancillary programs)',
    },
  ];

  const loadData = ({
    sorting,
    pageSize,
    currentPage,
    searchValue,
    selection,
    filter,
  }) => {
    setTableOptions({
      sorting,
      pageSize,
      currentPage,
      searchValue,
      selection,
    });

    getMegacubesList({
      ordering: sorting,
      pageSize,
      page: currentPage + 1,
      search: searchValue,
      filter,
    }).then((res) => {
      setMegacubes({
        data: res.results,
        totalCount: res.count,
      });
    });
  };

  useEffect(() => {
    setOriginalImageData([]);
    if (selectedMegacube) {
      getOriginalImageHeatmap(selectedMegacube).then((res) => {
        setOriginalImageData(res);
      });
    }
  }, [selectedMegacube]);

  useEffect(() => {
    const headerHeight = 64;
    const tableToolbarHeight = 64.99;
    const tablePager = 71.95;

    setTableHeight(
      windowSize.height - headerHeight - tableToolbarHeight - tablePager
    );
  }, [windowSize.height]);

  const handleSectionWidthChange = (size) => setSectionWidth(size);

  const handleExplorerClick = () => {
    // Store last submitted period on local storage:
    localStorage.setItem(
      'previewSelections',
      JSON.stringify({
        ...tableOptions,
        selectedMegacube,
      })
    );

    history.push(`/explorer/${selectedMegacube}`);
  };

  return (
    <Container>
      <Section>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          selectedRow={selectedMegacube}
          setSelectedRow={setSelectedMegacube}
          defaultSearchValue={tableOptions.searchValue}
          defaultCurrentPage={tableOptions.currentPage}
          defaultSelection={tableOptions.selection}
          pageSize={tableOptions.pageSize}
          pageSizes={[20, 50, 100]}
          hasFiltering
          loadData={loadData}
          height={tableHeight}
          isVirtualTable
        />
      </Section>
      <Bar className={classes.resizeBar} size={3} />
      <Section
        className={classes.imageSection}
        onSizeChanged={handleSectionWidthChange}
      >
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
        {'z' in originalImageData ? (
          <OriginalImage data={originalImageData} sectionWidth={sectionWidth} />
        ) : null}
      </Section>
    </Container>
  );
}

export default Preview;
