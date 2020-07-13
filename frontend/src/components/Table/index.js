import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
  Table as MuiTable,
  PagingPanel,
  TableColumnResizing,
  Toolbar,
  SearchPanel,
  TableSelection,
  TableColumnVisibility,
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CustomColumnChooser from './CustomColumnChooser';
import CustomTableHeaderRowCell from './CustomTableHeaderRowCell';
import CustomToolbar from './CustomToolbar';
import styles from './styles';

function CustomNoDataCellComponent({ ...noDatProps }, customLoading) {
  const classes = styles();
  return (
    <td
      className={clsx(
        classes.noDataCell,
        'MuiTableCell-root',
        'MuiTableCell-body',
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
  isVirtualTable,
  setSelectedGalaxy,
  height,
  toolbarChildren,
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
      defaultSorting
      && defaultSorting[0].columnName
      && defaultSorting[0].direction
    ) {
      return defaultSorting;
    }
    if (columns && columns[0]) {
      return [
        {
          columnName: columns[0].name,
          direction: 'asc',
        },
      ];
    }
    return null;
  };

  const [customData, setCustomData] = useState(data);
  const [customTotalCount, setCustomTotalCount] = useState(totalCount);
  const [visible, setVisible] = useState(false);
  const [customLoading, setCustomLoading] = useState(true);
  const [sorting, setSorting] = useState(customSorting());
  const [currentPage, setCurrentPage] = useState(0);
  const [after, setAfter] = useState('');
  const [customPageSize, setCustomPageSize] = useState(pageSize);
  const [filter, setFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [selection, setSelection] = useState([]);
  const [customModalContent, setCustomModalContent] = useState('');

  const classes = styles();

  useEffect(() => {
    if (remote === true) {
      loadData({
        sorting,
        pageSize,
        currentPage,
        after,
        filter,
        searchValue,
      });
    }
  }, [sorting, currentPage, reload, pageSize, filter, searchValue]); // eslint-disable-line

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
    setSorting(value);
  };

  const changeCurrentPage = (value) => {
    const offset = value * pageSize;
    const next = window.btoa(`arrayconnection:${offset - 1}`);
    if (remote === true) {
      setCustomLoading(true);
    }
    setCurrentPage(value);
    setAfter(next);
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

  const handleChangeFilter = (evt) => {
    if (remote === true) {
      clearData();
      setCustomLoading(true);
    }
    setFilter(evt.target.value);
  };

  const onHideModal = () => setVisible(false);

  const renderModal = () => (
    <Dialog onClose={onHideModal} open={visible} maxWidth="md">
      {customModalContent || ''}
    </Dialog>
  );

  const renderLoading = () => (
    <CircularProgress
      style={{
        position: 'absolute',
        top: 'calc(50% - 40px)',
        left: 'calc(50% - 20px)',
        marginTop: 'translateY(-50%)',
        zIndex: '99',
      }}
    />
  );

  const renderFilter = () => (
    <FormControl className={classes.formControl}>
      <InputLabel shrink htmlFor="filter-label-placeholder">
        Filter
      </InputLabel>
      <Select
        value={filter}
        onChange={handleChangeFilter}
        input={<Input name="filter" id="filter-label-placeholder" />}
        displayEmpty
        name="filter"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="running">Running</MenuItem>
      </Select>
    </FormControl>
  );

  const onClickAction = (column, row) => {
    if (modalContent !== null) {
      setCustomModalContent('');
      setVisible(true);
    }
    column.action(row);
  };

  const renderTableOrVirtualTable = () => {
    if (loading !== null) {
      if (isVirtualTable) {
        return (
          <VirtualTable
            height={height}
            columnExtensions={customColumnExtensions}
            noDataCellComponent={(props) => CustomNoDataCellComponent({ ...props }, customLoading)}
          />
        );
      }
      return (
        <MuiTable
          columnExtensions={customColumnExtensions}
          noDataCellComponent={(props) => CustomNoDataCellComponent({ ...props }, customLoading)}
        />
      );
    }
    if (isVirtualTable) {
      return <VirtualTable height={height} columnExtensions={customColumnExtensions} />;
    }
    return <MuiTable columnExtensions={customColumnExtensions} />;
  };

  const renderTable = (rows) => {
    if (remote === true) {
      return (
        <>
          <Grid rows={rows} columns={customColumns}>
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
                style={{ cursor: 'pointer' }}
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
            <CustomTableHeaderRowCell hasSorting={hasSorting} />
            {hasGrouping ? <TableGroupRow /> : null}
            {hasPagination ? <PagingPanel pageSizes={pageSizes} /> : null}
            {hasToolbar ? <Toolbar rootComponent={(props) => CustomToolbar({ ...props, toolbarChildren })} /> : null}
            {hasSearching ? <SearchPanel /> : null}
            {hasColumnVisibility ? <TableColumnVisibility /> : null}
            {hasColumnVisibility ? <CustomColumnChooser setSelectedGalaxy={setSelectedGalaxy} /> : null}
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
              style={{ cursor: 'pointer' }}
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
          <CustomTableHeaderRowCell
            hasLineBreak={hasLineBreak}
            hasSorting={hasSorting}
            remote={remote}
          />
          {hasGrouping ? <TableGroupRow /> : null}
          {hasPagination ? <PagingPanel pageSizes={pageSizes} /> : null}
          {hasToolbar ? <Toolbar rootComponent={(props) => CustomToolbar({ ...props, toolbarChildren })} /> : null}
          {hasSearching ? <SearchPanel /> : null}
          {hasColumnVisibility ? <TableColumnVisibility /> : null}
          {hasColumnVisibility ? <CustomColumnChooser setSelectedGalaxy={setSelectedGalaxy} /> : null}
        </Grid>
        {renderModal()}
      </>
    );
  };

  const rows = customData.map((row) => {
    const line = {};
    Object.keys(row).forEach((key) => {
      const column = columns.filter((el) => el.name === key)[0];
      if (key in row) {
        if (
          (column && column.icon && typeof row[key] !== 'object')
          /*
          If the current row is an array or object, then verify if its length is higher than 1.
          This was created for the "Release" column,
          that sometimes has multiple releases for a single dataset.
          */
          || (column
            && column.icon
            && typeof row[key] === 'object' && row[key].length > 1
            && !column.customElement)
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
    const select = value[value.length - 1];

    if (setSelectedGalaxy) {
      setSelectedGalaxy(null);
      const cubename = rows[select].cube_name;
      setSelectedGalaxy(cubename);
    }

    setSelection([select]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 38 (ArrowUp)
      if (e.keyCode === 38) {
        const selectLine = selection.length > 0 && selection[0] !== 0 ? [selection[0] - 1] : [0];
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
    <>
      {hasFiltering ? renderFilter() : null}
      {renderTable(rows)}
      {customLoading && renderLoading()}
    </>
  );
}

Table.defaultProps = {
  loadData: () => null,
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
  isVirtualTable: false,
  setSelectedGalaxy: null,
  height: 530,
  toolbarChildren: null,
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadData: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  modalContent: PropTypes.symbol,
  defaultSorting: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/no-unused-prop-types
  pageSize: PropTypes.number,
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
  isVirtualTable: PropTypes.bool,
  setSelectedGalaxy: PropTypes.func,
  height: PropTypes.number,
  toolbarChildren: PropTypes.shape({
    $$typeof: PropTypes.symbol,
    props: PropTypes.shape({ name: PropTypes.string }),
    type: PropTypes.func,
  }),
};

export default memo(Table);
