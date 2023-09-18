import React, { useState } from 'react';
import { GalaxyContext } from './contexts/GalaxyContext';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes';

function App() {

  const [galaxy, setGalaxy] = useState({})
  const [queryOptions, setQueryOptions] = useState({
    paginationModel: { page: 0, pageSize: 2 },
    selectionModel: [],
    sortModel: [{ field: 'id', sort: 'asc' }],
    filterModel: { items: [] }
  })

  return (
    <GalaxyContext.Provider value={{
      galaxy,
      setGalaxy,
      queryOptions,
      setQueryOptions
    }}>
      <RouterProvider router={router} />
    </GalaxyContext.Provider>
  );
}

export default App;
