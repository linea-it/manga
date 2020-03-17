import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Table from '../../components/Table';
import { getMegacubesList } from '../../services/api';

function VerifierList({ setTitle }) {
  const [galaxies, setGalaxies] = useState({
    data: [],
    totalCount: 0,
  });

  useEffect(() => setTitle('Galaxies'), [setTitle]);

  const columns = [
    {
      name: 'galaxy_name',
      title: 'Galaxy',
      width: 500,
    },
    {
      name: 'type',
      title: 'Type',
      width: 200,
    },
    {
      name: 'ra',
      title: 'RA',
    },
    {
      name: 'dec',
      title: 'Dec',
    },
    {
      name: 'cube_name',
      title: 'Cube',
      width: 400,
    },
  ];

  const loadData = () => {
    getMegacubesList().then((res) => setGalaxies({
      data: res.megacubes.map((megacube) => ({
        ra: 0,
        dec: 0,
        type: null,
        galaxy_name: megacube,
        cube_name: megacube,
      })),
      totalCount: res.count,
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Table
          columns={columns}
          data={galaxies.data}
          totalCount={galaxies.totalCount}
        />
      </Grid>
    </Grid>
  );
}

VerifierList.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default VerifierList;
