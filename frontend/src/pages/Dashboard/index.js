import React, { useState, useCallback, useEffect } from 'react';
import { Container, Section, Bar } from 'react-simple-resizer';
import Table from '../../components/Table';
import Verifier from '../../components/Verifier';
import VerifierGrid from '../../components/VerifierGrid';
import { getMegacubesList } from '../../services/api';
import Switch from '../../components/Switch';

function Dashboard() {
  const [galaxies, setGalaxies] = useState({
    data: [],
    totalCount: 0,
  });
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [isGrid, setIsGrid] = useState(false);

  const columns = [
    {
      name: 'galaxy_name',
      title: 'Galaxy',
      width: 220,
    },
    {
      name: 'type',
      title: 'Type',
      width: 80,
    },
    {
      name: 'ra',
      title: 'RA',
      width: 70,
    },
    {
      name: 'dec',
      title: 'Dec',
      width: 70,
    },
    {
      name: 'cube_name',
      title: 'Cube',
      width: 220,
    },
  ];

  const loadData = useCallback(() => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, []);


  return (
    <Container>
      <Section>
        <Table
          columns={columns}
          data={galaxies.data}
          totalCount={galaxies.totalCount}
          // loadData={loadData}
          setSelectedGalaxy={setSelectedGalaxy}
          remote={false}
        />
      </Section>
      <Bar
        size={2}
        style={{
          background: '#aaa',
          cursor: 'col-resize',
        }}
      />
      <Section>
        <Switch isGrid={isGrid} setIsGrid={setIsGrid} />
        {isGrid ? (
          <VerifierGrid megacube={selectedGalaxy} />
        ) : (
          <Verifier megacube={selectedGalaxy} />
        )}
      </Section>
    </Container>
  );
}

export default Dashboard;
