import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import Table from '../../components/Table';

import data from './data.json';

function List() {
  const history = useHistory();
  const [currentUser] = useState({ username: 'Matheus' });
  const [megacubes, setMegacubes] = useState({ data: [], totalCount: 0 });

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

  const loadData = useCallback(() => {
    setMegacubes({
      data: data.map((row) => ({ ...row, preview: row.id })),
      totalCount: data.length,
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container direction="column" alignItems="stretch">
      <Grid item>
        <Header currentUser={currentUser} />
      </Grid>
      <Grid item>
        <Table
          columns={columns}
          data={megacubes.data}
          totalCount={megacubes.totalCount}
          pageSize={25}
          remote={false}
        />
      </Grid>
    </Grid>
  );
}

export default List;
