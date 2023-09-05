import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GalaxyContext } from '../../contexts/GalaxyContext';
import { useQuery } from 'react-query';
import { listAllGalaxies } from '../../services/api';


export default function GalaxyList() {

  // galaxyId represent Current Selected Galaxy, used in list, preview and explorer.
  const {galaxyId, setGalaxyId} = useContext(GalaxyContext)

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 2,
  });
  const [queryOptions, setQueryOptions] = React.useState({
    sortModel: [{ field: 'id', sort: 'asc' }],
  });

  const handleSortModelChange = React.useCallback((sortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({ sortModel: [...sortModel] });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['galaxies', { 
      page: paginationModel.page, 
      pageSize:paginationModel.pageSize,
      ...queryOptions
    }],
    queryFn: listAllGalaxies,
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    // refetchOnmount: false,
    // refetchOnReconnect: false,
    // retry: 1,
    // staleTime: 1 * 60 * 60 * 1000,
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

  // const [queryOptions, setQueryOptions] = React.useState({});

  // const onFilterChange = React.useCallback((filterModel) => {
  //   // Here you save the data you need from the filter model
  //   setQueryOptions({ filterModel: { ...filterModel } });
  // }, []);


  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      description: 'Internal ID for this object',
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
      // sortable: false,
      // width: 160,
      // valueGetter: (params) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

  return (
    <DataGrid
        rows={data?.results !== undefined ? data.results : []}
        columns={columns}
        rowCount={rowCountState}
        loading={isLoading}
        pageSizeOptions={[5, 20, 50, 100]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        initialState={{
          sorting: {
            sortModel: queryOptions.sortModel,
          },
        }}        
        // onRowSelectionModelChange={(newRowSelectionModel) => {
        //   console.log(newRowSelectionModel)
        //   setGalaxyId(newRowSelectionModel);
        // }}
        // rowSelectionModel={galaxyId}
        // filterMode="server"
        // onFilterModelChange={onFilterChange} 
      />
  );

}
GalaxyList.defaultProps = {
}
GalaxyList.propTypes = {
};