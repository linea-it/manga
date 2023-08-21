import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Section, Bar } from 'react-simple-resizer';
import { Grid, Button } from '@mui/material';
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
        }
      : {
          sorting: [],
          pageSize: 20,
          currentPage: 0,
        }
  );


  const columns = [
    // {
    //   name: 'index',
    //   title: ' ',
    //   width: 80,
    //   sortingEnabled: false,
    // },
    {
      name: 'id',
      title: 'ID',
      headerTooltip: 'Internal ID for this object',
    },    
    {
      name: 'plateifu',
      title: 'PlateIFU',
      headerTooltip: '	Plate+ifudesign name for this object',
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
      name: 'fcfc1_50',
      title: 'FCFC1.50',
      sortingEnabled: true,      
    },
    {
      name: 'xyy_light',
      title: 'xyy_light',
      sortingEnabled: true,      
    },
    {
      name: 'xyo_light',
      title: 'xyo_light',
      sortingEnabled: true,      
    },
    {
      name: 'xiy_light',
      title: 'xiy_light',
      sortingEnabled: true,      
    },
    {
      name: 'xii_light',
      title: 'xii_light',
      sortingEnabled: true,      
    },
    {
      name: 'xio_light',
      title: 'xio_light',
      sortingEnabled: true,      
    },
    {
      name: 'xo_light',
      title: 'xo_light',
      sortingEnabled: true,      
    },
    {
      name: 'xyy_mass',
      title: 'xyy_mass',
      sortingEnabled: true,      
    },
    {
      name: 'xyo_mass',
      title: 'xyo_mass',
      sortingEnabled: true,      
    },
    {
      name: 'xiy_mass',
      title: 'xiy_mass',
      sortingEnabled: true,      
    },
    {
      name: 'xii_mass',
      title: 'xii_mass',
      sortingEnabled: true,      
    },
    {
      name: 'xio_mass',
      title: 'xio_mass',
      sortingEnabled: true,      
    },                                
    {
      name: 'xo_mass',
      title: 'xo_mass',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_1',
      title: 'SFR_1',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_5',
      title: 'SFR_5',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_10',
      title: 'SFR_10',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_14',
      title: 'SFR_14',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_20',
      title: 'SFR_20',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_30',
      title: 'SFR_30',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_56',
      title: 'SFR_56',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_100',
      title: 'SFR_100',
      sortingEnabled: true,      
    },
    {
      name: 'sfr_200',
      title: 'SFR_200',
      sortingEnabled: true,      
    },
    {
      name: 'av_star',
      title: 'Av_star',
      sortingEnabled: true,      
    },
    {
      name: 'mage_l',
      title: 'Mage_L',
      sortingEnabled: true,      
    },
    {
      name: 'mage_m',
      title: 'Mage_M',
      sortingEnabled: true,      
    },
    {
      name: 'mz_l',
      title: 'MZ_L',
      sortingEnabled: true,      
    },
    {
      name: 'mz_m',
      title: 'MZ_M',
      sortingEnabled: true,      
    },
    {
      name: 'mstar',
      title: 'Mstar',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_star',
      title: 'Sigma_star',
      sortingEnabled: true,      
    },
    {
      name: 'vrot_star',
      title: 'vrot_star',
      sortingEnabled: true,      
    },
    {
      name: 'f_hb',
      title: 'f(hb)',
      sortingEnabled: true,      
    },
    {
      name: 'f_o3_4959',
      title: 'f(o3_4959)',
      sortingEnabled: true,      
    },
    {
      name: 'f_o3_5007',
      title: 'f(o3_5007)',
      sortingEnabled: true,      
    },
    {
      name: 'f_he1_5876',
      title: 'f(He1_5876)',
      sortingEnabled: true,      
    },
    {
      name: 'f_o1_6300',
      title: 'f(o1_6300)',
      sortingEnabled: true,      
    }, 
    {
      name: 'f_n2_6548',
      title: 'f(n2_6548)',
      sortingEnabled: true,      
    },
    {
      name: 'f_ha',
      title: 'f(ha)',
      sortingEnabled: true,      
    },
    {
      name: 'f_n2_6583',
      title: 'f(n2_6583)',
      sortingEnabled: true,      
    },
    {
      name: 'f_s2_6716',
      title: 'f(s2_6716)',
      sortingEnabled: true,      
    },
    {
      name: 'f_s2_6731',
      title: 'f(s2_6731)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_hb',
      title: 'eqw(hb)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_o3_4959',
      title: 'eqw(o3_4959)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_o3_5007',
      title: 'eqw(o3_5007)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_he1_5876',
      title: 'eqw(He1_5876)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_o1_6300',
      title: 'eqw(o1_6300)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_n2_6548',
      title: 'eqw_n2_6548',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_ha',
      title: 'eqw(ha)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_n2_6583',
      title: 'eqw(n2_6583)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_s2_6716',
      title: 'eqw(s2_6716)',
      sortingEnabled: true,      
    },
    {
      name: 'eqw_s2_6731',
      title: 'eqw(s2_6731)',
      sortingEnabled: true,      
    },
    {
      name: 'v_hb',
      title: 'v(hb)',
      sortingEnabled: true,      
    },
    {
      name: 'v_o3_4959',
      title: 'v(o3_4959)',
      sortingEnabled: true,      
    },      
    {
      name: 'v_o3_5007',
      title: 'v(o3_5007)',
      sortingEnabled: true,      
    },
    {
      name: 'v_he1_5876',
      title: 'v(He1_5876)',
      sortingEnabled: true,      
    },
    {
      name: 'v_o1_6300',
      title: 'v(o1_6300)',
      sortingEnabled: true,      
    },
    {
      name: 'v_n2_6548',
      title: 'v(n2_6548)',
      sortingEnabled: true,      
    },
    {
      name: 'v_ha',
      title: 'v(ha)',
      sortingEnabled: true,      
    },
    {
      name: 'v_n2_6583',
      title: 'v(n2_6583)',
      sortingEnabled: true,      
    },
    {
      name: 'v_s2_6716',
      title: 'v(s2_6716)',
      sortingEnabled: true,      
    },
    {
      name: 'v_s2_6731',
      title: 'v(s2_6731)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_hb',
      title: 'sigma(hb)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_o3_4959',
      title: 'sigma(o3_4959)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_o3_5007',
      title: 'sigma(o3_5007)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_he1_5876',
      title: 'sigma(He1_5876)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_o1_6300',
      title: 'sigma(o1_6300)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_n2_6548',
      title: 'sigma(n2_6548)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_ha',
      title: 'sigma(ha)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_n2_6583',
      title: 'sigma(n2_6583)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_s2_6716',
      title: 'sigma(s2_6716)',
      sortingEnabled: true,      
    },
    {
      name: 'sigma_s2_6731',
      title: 'sigma(s2_6731)',
      sortingEnabled: true,      
    },   
    {
      name: 'had_bcomp',
      title: 'B. Comp',
      sortingEnabled: true,      
    },     
  ];

  const loadData = ({
    sorting,
    pageSize,
    currentPage,
    searchValue,
    filter,
  }) => {
    setTableOptions({
      sorting,
      pageSize,
      currentPage,
      searchValue,
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
      // Store last submitted period on local storage:
      localStorage.setItem(
        'previewSelections',
        JSON.stringify({
          sorting,
          pageSize,
          currentPage,
          selectedMegacube
        })
      );

      if (selectedMegacube === null && res.results.length > 0) {
        setSelectedMegacube(res.results[0].id)
      }
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
    history.push(`/explorer/${selectedMegacube}`);
  };

  const onChangeSelectedRow = (selected) => {
    console.log("onChangeSelectedRow", selected)

    // Store last submitted period on local storage:
    if (selected !== selectedMegacube) {
      localStorage.setItem(
        'previewSelections',
        JSON.stringify({
          ...tableOptions,
          selectedMegacube:selected,
        })
      );

      setSelectedMegacube(selected)
    }
  }

  return (
    <Container>
      <Section>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          selectedRow={selectedMegacube}
          onChangeSelectedRow={onChangeSelectedRow}
          // defaultSearchValue={tableOptions.searchValue}
          defaultCurrentPage={tableOptions.currentPage}
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
