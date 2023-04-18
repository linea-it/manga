import React, { useState, useEffect } from 'react';
import {
  Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Table from '../../components/Table';
import useWindowSize from '../../hooks/useWindowSize';
import TableToolbar from './TableToolbar';
import data from './data.json';

function List() {
  const history = useHistory();
  const windowSize = useWindowSize();
  const [megacubes, setMegacubes] = useState({ data: [], totalCount: 0 });
  const [tableHeight, setTableHeight] = useState(0);

  const columns = [
    {
      name: 'id',
      title: 'ID',
    },
    {
      name: 'name',
      title: 'Name',
      width: 350,
    },
    {
      name: 'creator',
      title: 'Creator',
      width: 300,
    },
    {
      name: 'objects',
      title: 'Objects',
    },
    {
      name: 'created_at',
      title: 'Date',
      width: 150,
      align: 'center',
    },
    {
      name: 'preview',
      title: 'Preview',
      icon: <i className="fas fa-eye" />,
      action: (row) => history.push(`/preview/${row.id}`),
      align: 'center',
      sortingEnabled: false,
    },
  ];

  const loadData = () => {
    setMegacubes({
      data: data.map((row) => ({ ...row, preview: row.id })),
      totalCount: data.length,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const headerHeight = 55.97;
    const tableToolbarHeight = 64.99;
    const tablePager = 71.95;

    setTableHeight(
      windowSize.height
      - headerHeight
      - tableToolbarHeight
      - tablePager,
    );
  }, [windowSize.height]);

  return (
    <Grid container direction="column" alignItems="stretch">
      <Grid item xs={12}>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          pageSize={100}
          pageSizes={[100, 200, 300]}
          height={tableHeight}
          remote={false}
          toolbarChildren={<TableToolbar />}
          isVirtualTable
        />
      </Grid>
    </Grid>
  );
}

export default List;
