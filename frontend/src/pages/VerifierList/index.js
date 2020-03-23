import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Icon,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import { getMegacubesList } from '../../services/api';
import styles from './styles';

function VerifierList({ setTitle }) {
  const classes = styles();
  const [galaxies, setGalaxies] = useState({
    data: [],
    totalCount: 0,
  });

  useEffect(() => setTitle('Galaxies'), [setTitle]);

  const columns = [
    {
      name: 'galaxy_name',
      title: 'Galaxy',
      width: 300,
    },
    {
      name: 'type',
      title: 'Type',
      width: 150,
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
      width: 250,
    },
    {
      name: 'verifier',
      title: 'Verifier',
      customElement: (row) => (
        <Link to={`/verifier/${row.cube_name}`} className={classes.defaultColor}>
          <Icon className="fa fa-cog" />
        </Link>
      ),
      align: 'center',
    },
    {
      name: 'grid',
      title: 'Grid',
      customElement: (row) => (
        <Link to={`/grid/${row.cube_name}`} className={classes.defaultColor}>
          <Icon className="fa fa-th-large" />
        </Link>
      ),
      align: 'center',
    },
  ];

  const loadData = () => {
    getMegacubesList().then((res) => setGalaxies({
      data: res.megacubes.map((megacube) => ({
        ra: 0,
        dec: 0,
        type: null,
        galaxy_name: megacube,
        cube_name: megacube.split('.fits')[0],
        verifier: megacube,
        grid: megacube,
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
          remote={false}
        />
      </Grid>
    </Grid>
  );
}

VerifierList.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default VerifierList;
