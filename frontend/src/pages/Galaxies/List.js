import React, { useContext } from 'react';
import { 
  DataGrid, 
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { GalaxyContext } from '../../contexts/GalaxyContext';
import { useQuery } from 'react-query';
import { listAllGalaxies } from '../../services/api';
import { Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function GalaxyList() {

  // galaxy represent Current Selected Galaxy, used in list, preview and explorer.
  const { queryOptions, setQueryOptions, setGalaxy } = useContext(GalaxyContext)
  const {paginationModel, sortModel, filterModel} = queryOptions
  const { data, isLoading } = useQuery({
    queryKey: ['galaxies', {paginationModel, sortModel, filterModel } ],    
    queryFn: listAllGalaxies,
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    // retry: 1,
    staleTime: 1 * 60 * 60 * 1000,
  })


  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = React.useState(
    data?.count || 0,
  );

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.count !== undefined
        ? data?.count
        : prevRowCountState,
    );
  }, [data?.count, setRowCountState]);

  const selectRow = React.useCallback((row) => {
    // Only one galaxy can be consider as active/select object.
    // But datagrid still can  handle multiple selections. 

    setQueryOptions(prev => {
      return {
        ...prev, 
        selectionModel: [row.id]  
      }
    })
    setGalaxy(row)
  }, [setGalaxy, setQueryOptions])

  React.useEffect(() => {
    if (queryOptions.selectionModel.length === 0) {
      if (data?.results !== undefined && data.results.length > 0) {
        selectRow(data.results[0])
      }
    }
  }, [data, queryOptions, selectRow]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      description: 'Internal ID for this object',
      type: 'number',
      width: 100
    },
    {
      field: 'ned_name',
      headerName: 'Common Name',
      width: 200,
    },
    {
      field: 'objra',
      headerName: 'RA',
      description: 'Right ascension of the science object in J2000 (degrees)',
      type: 'number',
      width: 110,
    },
    {
      field: 'objdec',
      headerName: 'Dec',
      description: 'Declination of the science object in J2000 (degrees)',
      type: 'number',
      width: 110,
    },
    {
      field: 'plateifu',
      headerName: 'PlateIFU',
      description: 'Plate+ifudesign name for this object',
    },
    {
      field: 'mangaid',
      headerName: 'MaNGA-ID',
      description: 'MaNGA ID for this object (e.g. 1-114145)'
    },

    {
      field: 'had_bcomp',
      headerName: 'B. Comp',
      description: 'Indicates whether the object has Broad component attribute.',
      type: 'boolean',
    },
  ];

  const handleDownload = React.useCallback(() => {
    const link = document.createElement("a");
    link.download = `megacube_mean_properties_table_Riffel_2023.fits.tar.gz`;
    link.href = "/table/megacube_mean_properties_table_Riffel_2023.fits.tar.gz";
    link.click();
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button 
          onClick={handleDownload}
          startIcon={<DownloadIcon />}>Download mean properties file</Button>
      </GridToolbarContainer>
    );
  }



  // <Button variant="contained" color="primary" onClick={onDownload} >
  // Download mean properties file
  // </Button> 

  return (
    <Box style={{ minHeight: 400, height:'100%', width: '100%' }}>
    <DataGrid
      rows={data?.results !== undefined ? data.results : []}
      columns={columns}
      rowCount={rowCountState}
      loading={isLoading}
      pageSizeOptions={[20, 50, 100]}
      autoHeight
      paginationModel={queryOptions.paginationModel}
      paginationMode="server"
      onPaginationModelChange={(paginationModel) => {
        setQueryOptions(prev => {
          return {
            ...prev,
            paginationModel: { ...paginationModel }
          }
        })
      }}
      filterMode="server"
      onFilterModelChange={(filterModel)=>{
        setQueryOptions(prev => {
          return {
            ...prev,
            paginationModel: {
              ...prev.paginationModel,
              page: 0,
            },
            filterModel: {...filterModel}
          }
        })
      }}
      sortingMode="server"
      onSortModelChange={(sortModel) => {
        setQueryOptions(prev => {
          return {
            ...prev,
            sortModel: [...sortModel]
          }
        })
      }}
      onRowSelectionModelChange={(selectionModel) => {
        // Get Selected Row:
        const selectedRowsData = selectionModel.map((id) => data.results.find((row) => row.id === id));
        selectRow(selectedRowsData[0])
      }}
      rowSelectionModel={queryOptions.selectionModel}
      keepNonExistentRowsSelected
      initialState={{
        sorting: {
          sortModel: queryOptions.sortModel,
        },
      }}
      // slots={{
      //   toolbar: GridToolbar,
      // }}
      slots={{
        toolbar: CustomToolbar,
      }}
    />
    </Box>    
  );

}
GalaxyList.defaultProps = {
}
GalaxyList.propTypes = {
};