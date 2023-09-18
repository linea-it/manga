import React, { useContext } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,

} from '@mui/x-data-grid';
import { GalaxyContext } from '../../contexts/GalaxyContext';
import { useQuery } from 'react-query';
import { listAllGalaxies } from '../../services/api';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { galaxyListColumns, columnVisibilityModel } from './Columns'
import CustomPagination from '../../components/DataGrid/Pagination';
import CustomToolbar from '../../components/DataGrid/Toolbar';


export default function GalaxyList() {
  // galaxy represent Current Selected Galaxy, used in list, preview and explorer.
  const { queryOptions, setQueryOptions, setGalaxy } = useContext(GalaxyContext)
  const { paginationModel, sortModel, filterModel } = queryOptions
  const { data, isLoading } = useQuery({
    queryKey: ['galaxies', { paginationModel, sortModel, filterModel }],
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

  // TODO: Implementar a seleção usando o padrão da datagrid:
  // https://mui.com/x/react-data-grid/state/#direct-selector-access

  // TODO: Seleção usando seta para baixo no teclado pode ser implementado com este evento:
  // https://mui.com/x/api/data-grid/data-grid/#DataGrid-prop-onCellKeyDown
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

  return (
    <DataGrid
      pagination
      rows={data?.results !== undefined ? data.results : []}
      columns={galaxyListColumns}
      rowCount={rowCountState}
      loading={isLoading}
      pageSizeOptions={[2, 50, 100]}
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
      onFilterModelChange={(filterModel) => {
        setQueryOptions(prev => {
          return {
            ...prev,
            paginationModel: {
              ...prev.paginationModel,
              page: 0,
            },
            filterModel: { ...filterModel }
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
        pagination: {
          paginationModel: {
            pageSize: 2,
          },
        },
        sorting: {
          sortModel: queryOptions.sortModel,
        },
        columns: {
          columnVisibilityModel: { ...columnVisibilityModel }
        }
      }}
      slots={{
        toolbar: CustomToolbar,
        pagination: CustomPagination,
      }}
    />
  );

}
GalaxyList.defaultProps = {
}
GalaxyList.propTypes = {
};
