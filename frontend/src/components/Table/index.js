import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  PagingState,
  SortingState,
  CustomPaging,
  SearchState,
  SelectionState,
  GroupingState,
  IntegratedSorting,
  IntegratedPaging,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  Table as DxMuiTable,
  PagingPanel,
  TableColumnResizing,
  Toolbar,
  SearchPanel,
  TableSelection,
  TableColumnVisibility,
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui';
import {
  MenuItem,
  CircularProgress,
  Button,
  Grid as MuiGrid,
  Toolbar as MuiToolbar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableBody as MuiTableBody,
} from '@material-ui/core';
import {
  FilterList as FilterListIcon,
  AddBox as AddBoxIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@material-ui/icons';
import ColumnChooser from './ColumnChooser';
import HeaderRowCell from './HeaderRowCell';
import RowIndexer from './plugins/RowIndexer';
import useStyles from './styles';

function CustomNoDataCellComponent({ ...noDatProps }, customLoading) {
  const classes = useStyles();
  return (
    <td
      className={clsx(
        classes.noDataCell,
        'MuiTableCell-root',
        'MuiTableCell-body'
      )}
      {...noDatProps}
    >
      <div className={classes.noDataWrapper}>
        <big className={classes.noDataText}>
          {customLoading ? 'Loading...' : 'No Data'}
        </big>
      </div>
    </td>
  );
}

function Table({
  columns,
  data,
  totalCount,
  defaultSorting,
  grouping,
  remote,
  defaultCurrentPage,
  pageSize,
  loadData,
  hasSorting,
  pageSizes,
  hasGrouping,
  hasResizing,
  hasSelection,
  hasPagination,
  hasToolbar,
  hasSearching,
  hasColumnVisibility,
  defaultExpandedGroups,
  reload,
  modalContent,
  hasFiltering,
  hasLineBreak,
  loading,
  defaultSelection,
  selectedRow,
  setSelectedRow,
  isVirtualTable,
  height,
  defaultSearchValue,
}) {
  const customColumns = columns.map((column) => ({
    name: column.name,
    title: column.title,
    hasLineBreak: column.hasLineBreak ? column.hasLineBreak : false,
    headerTooltip: column.headerTooltip ? column.headerTooltip : false,
  }));

  const customColumnExtensions = columns.map((column) => ({
    columnName: column.name,
    width: !column.width ? 120 : column.width,
    maxWidth: column.maxWidth ? column.maxWidth : '',
    sortingEnabled: !!(
      !('sortingEnabled' in column) || column.sortingEnabled === true
    ),
    align:
      !('align' in column) || column.align === 'left' ? 'left' : column.align,
    wordWrapEnabled: !(
      !('wordWrapEnabled' in column) || column.wordWrapEnabled === false
    ),
  }));

  const customDefaultColumnWidths = columns.map((column) => ({
    columnName: column.name,
    width: !column.width ? 120 : column.width,
  }));

  const customSorting = () => {
    if (
      defaultSorting &&
      defaultSorting[0].columnName &&
      defaultSorting[0].direction
    ) {
      return defaultSorting;
    }
    if (customColumns) {
      if (customColumns[0] && customColumns[0].name !== 'index') {
        return [
          {
            columnName: customColumns[0].name,
            direction: 'asc',
          },
        ];
      }

      if (
        customColumns[0] &&
        customColumns[0].name === 'index' &&
        customColumns[1]
      ) {
        return [
          {
            columnName: customColumns[1].name,
            direction: 'asc',
          },
        ];
      }
    }
    return null;
  };

  const [customData, setCustomData] = useState(data);
  const [customTotalCount, setCustomTotalCount] = useState(totalCount);
  const [visible, setVisible] = useState(false);
  const [customLoading, setCustomLoading] = useState(true);
  const [sorting, setSorting] = useState(customSorting());
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [after, setAfter] = useState('');
  const [customPageSize, setCustomPageSize] = useState(pageSize);
  const [searchValue, setSearchValue] = useState(defaultSearchValue);
  const [selection, setSelection] = useState(defaultSelection);
  const [customModalContent, setCustomModalContent] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterFormRef = useRef(null);
  const [filterForm, setFilterForm] = useState({
    property: '',
    operator: '',
  });
  const [filterValues, setFilterValues] = useState([]);
  const [filter, setFilter] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    if (remote === true) {
      loadData({
        sorting,
        pageSize: customPageSize,
        currentPage,
        after,
        filter,
        searchValue,
        selection,
      });
    }
  }, [
    sorting,
    selection,
    currentPage,
    reload,
    customPageSize,
    filter,
    searchValue,
  ]);

  const clearData = () => {
    setCustomData([]);
    setCustomLoading(true);
    setCurrentPage(0);
    setAfter('');
  };

  useEffect(() => {
    setCustomData(data);
    setCustomTotalCount(totalCount);
    setCustomLoading(false);
  }, [data, totalCount, defaultExpandedGroups]);

  const onClickAction = (column, row) => {
    if (modalContent !== null) {
      setCustomModalContent('');
      setVisible(true);
    }
    column.action(row);
  };

  const rows = customData.map((row) => {
    const line = {};
    Object.keys(row).forEach((key) => {
      const column = columns.filter((el) => el.name === key)[0];
      if (key in row) {
        if (
          (column && column.icon && typeof row[key] !== 'object') ||
          /*
          If the current row is an array or object, then verify if its length is higher than 1.
          This was created for the "Release" column,
          that sometimes has multiple releases for a single dataset.
          */
          (column &&
            column.icon &&
            typeof row[key] === 'object' &&
            row[key].length > 1 &&
            !column.customElement)
        ) {
          if (column.action) {
            line[key] = (
              <>
                <Button onClick={() => onClickAction(column, row)}>
                  {column.icon}
                </Button>
              </>
            );
          } else {
            line[key] = <>{column.icon}</>;
          }
          /*
            If the current row has a custom element, than render it, instead of the default.
          */
        } else if (column && column.customElement) {
          line[key] = column.customElement(row);
        } else {
          line[key] = row[key];
        }
      } else if (column && column.customElement) {
        line[key] = column.customElement(row);
      } else {
        line[key] = '-';
      }
    });
    return line;
  });



  const changeSelection = (value) => {
    let select = value;

    if (value.length > 0) {
      const diff = value.filter((x) => !selection.includes(x));
      select = diff;
    } else {
      select = [];
    }

    setSelectedRow(null);
    if (setSelectedRow && select.length > 0) {
      setSelectedRow(rows[select].id);
    }

    setSelection(select);
  };


  useEffect(() => {
    if (selectedRow) {
      const megacubeOnTable =
        data.filter((megacube) => megacube.id === selectedRow).length > 0;

      if (!megacubeOnTable) {
        changeSelection([]);
      } else {
        data.forEach((row, i) => {
          if (row.id === selectedRow) {
            if (selection[0] !== i) {
              setSelection([i]);
            }
          }
        });
      }
    }
  }, [data, selectedRow]);

  useEffect(() => {
    if (loading !== null) setCustomLoading(loading);
  }, [loading]);

  useEffect(() => {
    setCustomModalContent(modalContent);
  }, [modalContent]);

  const changeSorting = (value) => {
    if (remote === true) {
      clearData();
      setCustomLoading(true);
    }

    setSorting([value[value.length - 1]]);
  };

  const changeCurrentPage = (value) => {
    const offset = value * pageSize;
    const next = window.btoa(`arrayconnection:${offset - 1}`);
    if (remote === true) {
      setCustomLoading(true);
    }
    setCurrentPage(value);
    setAfter(next);
    changeSelection([]);
  };

  const changePageSize = (value) => {
    const totalPages = Math.ceil(customTotalCount / value);
    const theCurrentPage = Math.min(currentPage, totalPages - 1);
    if (remote === true) {
      setCustomLoading(true);
    }
    setCurrentPage(theCurrentPage);
    setCustomPageSize(value);
  };

  const changeSearchValue = (value) => {
    if (value.length > 2) {
      if (remote === true) {
        clearData();
        setCustomLoading(true);
      }
      setSearchValue(value);
    } else {
      setSearchValue('');
    }
  };



  const onHideModal = () => setVisible(false);

  const renderModal = () => (
    <Dialog onClose={onHideModal} open={visible} maxWidth="md">
      {customModalContent || ''}
    </Dialog>
  );

  const renderLoading = () => (
    <CircularProgress
      size={20}
      style={{
        position: 'absolute',
        top: 'calc(50% + 20px)',
        left: 'calc(50%)',
        marginTop: 'translateY(-50%)',
        zIndex: '99',
      }}
    />
  );



  const renderTableOrVirtualTable = () => {
    if (loading !== null) {
      if (isVirtualTable) {
        return (
          <VirtualTable
            height={height}
            columnExtensions={customColumnExtensions}
            noDataCellComponent={(props) =>
              CustomNoDataCellComponent({ ...props }, customLoading)
            }
          />
        );
      }
      return (
        <DxMuiTable
          columnExtensions={customColumnExtensions}
          noDataCellComponent={(props) =>
            CustomNoDataCellComponent({ ...props }, customLoading)
          }
        />
      );
    }
    if (isVirtualTable) {
      return (
        <VirtualTable
          height={height}
          columnExtensions={customColumnExtensions}
        />
      );
    }
    return <DxMuiTable columnExtensions={customColumnExtensions} />;
  };

  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `megacube_mean_properties_table_Riffel_2023.fits.tar.gz`;
    link.href = "/table/megacube_mean_properties_table_Riffel_2023.fits.tar.gz";
    link.click();
  };

  const customToolbar = ({ children }) => (
    <MuiToolbar className={classes.toolbar}>
      <IconButton
        className={classes.filterButton}
        onClick={() => setFilterOpen(true)}
      >
        <FilterListIcon />
      </IconButton>
      <div>
        <Button variant="contained" color="primary" onClick={onDownload} >
          Download mean properties file
        </Button>       
      </div>
      {children}         
    </MuiToolbar>
  );

  const handleFormChange = (row, field) => {
    setFilterForm((prevState) => ({
      ...prevState,
      [field]: row.target.value,
    }));
  };

  const handleAddFilter = () => {
    const { value } = filterFormRef.current.value;
    const propertyName = JSON.parse(filterForm.property).name;
    const filterProperty =
      filterValues.length > 0
        ? filterValues.filter((f) => f.propertyName === propertyName)
        : [];
    if (
      filterProperty.length === 0 &&
      value !== '' &&
      filterForm.property !== '' &&
      filterForm.operator !== ''
    ) {
      setFilterValues((prevState) => [
        ...prevState,
        {
          propertyTitle: JSON.parse(filterForm.property).title,
          propertyName: JSON.parse(filterForm.property).name,
          operator: filterForm.operator,
          value,
        },
      ]);

      filterFormRef.current.reset();

      setFilterForm({
        property: '',
        operator: '',
      });
    }
  };

  const removeFilter = (row) => {
    const newFilter = filterValues.filter(
      (f) => f.propertyName !== row.propertyName
    );
    setFilterValues(newFilter);

    if (newFilter.length === 0) {
      setFilter([]);
    }
  };

  const handleFilterApply = () => {
    const operators = {
      is_equal_to: '',
      is_not_equal_to: '!',
      is_greater_than: '__gt',
      is_greater_than_or_equal_to: '__gte',
      is_less_than: '__lt',
      is_less_than_or_equal_to: '__lte',
    };

    if (filterValues.length > 0) {
      const filters = filterValues.map((f) => {
        const property = f.propertyName;
        const operator = operators[f.operator.split(' ').join('_')];
        const { value } = f;

        return `${property}${operator}=${encodeURIComponent(value)}`;
      });

      setFilter(filters);
      setFilterOpen(false);
      if (currentPage !== 0) {
        changeCurrentPage(0);
      }
    }
  };

  const renderFilter = () => (
    <Dialog
      onClose={() => setFilterOpen(false)}
      open={filterOpen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <form ref={filterFormRef} noValidate autoComplete="off">
          <MuiGrid container justify="center" alignItems="flex-end" spacing={2}>
            <MuiGrid item xs={12} md={11}>
              <MuiGrid container spacing={2}>
                <MuiGrid item xs={12} md={4}>
                  <TextField
                    select
                    label="Property"
                    name="property"
                    margin="dense"
                    onChange={(row) => handleFormChange(row, 'property')}
                    value={filterForm.property}
                    required
                    fullWidth
                  >
                    {columns.map(
                      (column) =>
                        column.name !== 'index' && (
                          <MenuItem
                            key={column.name}
                            value={`{ "name": "${column.name}", "title": "${column.title}" }`}
                          >
                            {column.title}
                          </MenuItem>
                        )
                    )}
                  </TextField>
                </MuiGrid>
                <MuiGrid item xs={12} md={4}>
                  <TextField
                    select
                    label="Operator"
                    name="operator"
                    margin="dense"
                    onChange={(row) => handleFormChange(row, 'operator')}
                    value={filterForm.operator}
                    required
                    fullWidth
                  >
                    <MenuItem value="is equal to">is equal to</MenuItem>
                    <MenuItem value="is not equal to">is not equal to</MenuItem>
                    <MenuItem value="is greater than">is greater than</MenuItem>
                    <MenuItem value="is greater than or equal to">
                      is greater than or equal to
                    </MenuItem>
                    <MenuItem value="is less than">is less than</MenuItem>
                    <MenuItem value="is less than or equal to">
                      is less than or equal to
                    </MenuItem>
                  </TextField>
                </MuiGrid>
                <MuiGrid item xs={12} md={4}>
                  <TextField
                    label="Value"
                    name="value"
                    margin="dense"
                    required
                    fullWidth
                  />
                </MuiGrid>
              </MuiGrid>
            </MuiGrid>
            <MuiGrid item xs={12} md={1}>
              <IconButton
                className={classes.addFilter}
                disableRipple
                onClick={handleAddFilter}
              >
                <AddBoxIcon fontSize="large" color="primary" />
              </IconButton>
            </MuiGrid>

            <MuiGrid item xs={12}>
              <MuiTable
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <MuiTableHead>
                  <MuiTableRow>
                    <MuiTableCell className={classes.firstTableCell}>
                      Property
                    </MuiTableCell>
                    <MuiTableCell>Operator</MuiTableCell>
                    <MuiTableCell>Value</MuiTableCell>
                    <MuiTableCell />
                  </MuiTableRow>
                </MuiTableHead>
                <MuiTableBody>
                  {filterValues.length > 0 &&
                    filterValues.map((row) => (
                      <MuiTableRow key={row.propertyName}>
                        <MuiTableCell className={classes.firstTableCell}>
                          {row.propertyTitle}
                        </MuiTableCell>
                        <MuiTableCell>{row.operator}</MuiTableCell>
                        <MuiTableCell>{row.value}</MuiTableCell>
                        <MuiTableCell align="right">
                          <IconButton onClick={() => removeFilter(row)}>
                            <RemoveCircleIcon color="error" />
                          </IconButton>
                        </MuiTableCell>
                      </MuiTableRow>
                    ))}
                </MuiTableBody>
              </MuiTable>
            </MuiGrid>
          </MuiGrid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setFilterOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleFilterApply}
          disabled={filterValues.length === 0}
          color="primary"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTable = (rows) => {
    if (remote === true) {
      return (
        <>
          <Grid rows={rows} columns={customColumns}>
            {/* {hasToolbar ? <Toolbar /> : null} */}
            {hasToolbar ? <Toolbar rootComponent={customToolbar} /> : null}
            {hasSearching ? (
              <SearchState onValueChange={changeSearchValue} />
            ) : null}
            {hasSorting ? (
              <SortingState
                sorting={sorting}
                onSortingChange={changeSorting}
                columnExtensions={customColumnExtensions}
              />
            ) : null}
            {hasPagination ? (
              <PagingState
                currentPage={currentPage}
                onCurrentPageChange={changeCurrentPage}
                pageSize={customPageSize}
                onPageSizeChange={changePageSize}
              />
            ) : null}
            {hasPagination ? (
              <CustomPaging totalCount={customTotalCount} />
            ) : null}
            {hasSelection ? (
              <SelectionState
                selection={selection}
                onSelectionChange={changeSelection}
              />
            ) : null}
            {hasGrouping ? (
              <GroupingState
                grouping={grouping}
                defaultExpandedGroups={defaultExpandedGroups}
              />
            ) : null}
            {hasGrouping ? <IntegratedGrouping /> : null}
            {renderTableOrVirtualTable()}
            {hasSelection ? (
              <TableSelection
                selectByRowClick
                highlightRow
                showSelectionColumn={false}
              />
            ) : null}
            {hasResizing ? (
              <TableColumnResizing
                defaultColumnWidths={customDefaultColumnWidths}
              />
            ) : null}
            <HeaderRowCell hasSorting={hasSorting} />
            {hasGrouping ? <TableGroupRow /> : null}
            {hasPagination ? <PagingPanel pageSizes={pageSizes} /> : null}
            {/* {hasToolbar ? <Toolbar /> : null} */}
            {hasSearching ? <SearchPanel /> : null}
            {hasColumnVisibility ? <TableColumnVisibility /> : null}
            {hasColumnVisibility ? <ColumnChooser /> : null}

            <RowIndexer />
          </Grid>
          {renderModal()}
        </>
      );
    }
    return (
      <>
        <Grid rows={rows} columns={customColumns}>
          {hasSearching ? <SearchState /> : null}
          {hasSorting ? (
            <SortingState
              sorting={sorting}
              onSortingChange={changeSorting}
              columnExtensions={customColumnExtensions}
            />
          ) : null}
          {hasSorting ? <IntegratedSorting /> : null}
          {hasPagination ? (
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={setCurrentPage}
              onPageSizeChange={setCustomPageSize}
              pageSize={customPageSize}
            />
          ) : null}
          {hasPagination ? <IntegratedPaging /> : null}
          {hasSelection ? (
            <SelectionState
              selection={selection}
              onSelectionChange={changeSelection}
            />
          ) : null}
          {hasGrouping ? (
            <GroupingState
              grouping={grouping}
              defaultExpandedGroups={defaultExpandedGroups}
            />
          ) : null}
          {hasGrouping ? <IntegratedGrouping /> : null}
          {renderTableOrVirtualTable()}

          {hasSelection ? (
            <TableSelection
              selectByRowClick
              highlightRow
              showSelectionColumn={false}
            />
          ) : null}
          {hasResizing ? (
            <TableColumnResizing
              defaultColumnWidths={customDefaultColumnWidths}
            />
          ) : null}
          <HeaderRowCell
            hasLineBreak={hasLineBreak}
            hasSorting={hasSorting}
            remote={remote}
          />
          {hasGrouping ? <TableGroupRow /> : null}
          {hasPagination ? <PagingPanel pageSizes={pageSizes} /> : null}
          {hasToolbar ? <Toolbar /> : null}
          {hasSearching ? <SearchPanel /> : null}
          {hasColumnVisibility ? <TableColumnVisibility /> : null}
          {hasColumnVisibility ? <ColumnChooser /> : null}
          <RowIndexer />
        </Grid>
        {renderModal()}
      </>
    );
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      // 38 (ArrowUp)
      if (e.keyCode === 38) {
        const selectLine =
          selection.length > 0 && selection[0] !== 0 ? [selection[0] - 1] : [0];
        changeSelection(selectLine);
      }

      // 40 (ArrowDown)
      if (e.keyCode === 40) {
        const selectLine = selection.length > 0 ? [selection[0] + 1] : [0];
        changeSelection(selectLine);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rows]);

  return (
    <div className={classes.container}>
      {hasFiltering ? renderFilter() : null}
      {renderTable(rows)}
      {customLoading && renderLoading()}
    </div>
  );
}

Table.defaultProps = {
  loadData: () => null,
  defaultCurrentPage: 0,
  pageSize: 10,
  pageSizes: [5, 10, 15],
  modalContent: null,
  hasFiltering: false,
  hasSearching: true,
  hasSorting: true,
  hasResizing: true,
  hasSelection: true,
  hasColumnVisibility: true,
  hasPagination: true,
  hasGrouping: false,
  hasToolbar: true,
  defaultExpandedGroups: [''],
  defaultSorting: null,
  totalCount: 0,
  reload: false,
  remote: true,
  hasLineBreak: false,
  grouping: [{}],
  loading: null,
  selectedRow: null,
  setSelectedRow: null,
  isVirtualTable: false,
  height: 'auto',
  defaultSearchValue: '',
  defaultSelection: [],
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadData: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  modalContent: PropTypes.symbol,
  defaultSorting: PropTypes.arrayOf(PropTypes.object),
  pageSize: PropTypes.number,
  defaultCurrentPage: PropTypes.number,
  pageSizes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.number,
  ]),
  hasFiltering: PropTypes.bool,
  hasSearching: PropTypes.bool,
  hasSorting: PropTypes.bool,
  hasResizing: PropTypes.bool,
  hasSelection: PropTypes.bool,
  hasColumnVisibility: PropTypes.bool,
  hasGrouping: PropTypes.bool,
  hasPagination: PropTypes.bool,
  hasToolbar: PropTypes.bool,
  hasLineBreak: PropTypes.bool,
  defaultExpandedGroups: PropTypes.arrayOf(PropTypes.string),
  totalCount: PropTypes.number,
  reload: PropTypes.bool,
  remote: PropTypes.bool,
  grouping: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  selectedRow: PropTypes.number,
  setSelectedRow: PropTypes.func,
  isVirtualTable: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultSearchValue: PropTypes.string,
  defaultSelection: PropTypes.arrayOf(PropTypes.number),
};

export default Table;
