import React, {useState} from 'react';
import { Router } from 'react-router-dom';
import ReactGA from 'react-ga';
import Routes from './routes';
import history from './services/history';
import { GalaxyContext } from './contexts/GalaxyContext';
// import light from './themes/light';


// ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

// history.listen((location) => {
//   ReactGA.set({ page: location.pathname }); // Update the user's current page
//   ReactGA.pageview(location.pathname); // Record a pageview for the given page
// });


function App() {

  const [galaxy, setGalaxy] = useState({})
  const [queryOptions, setQueryOptions ] = useState({
    paginationModel: { page: 0, pageSize: 1 },
    selectionModel: [],
    sortModel: [{ field: 'id', sort: 'asc' }],
    filterModel: {items: []}
  })

  return (
    <GalaxyContext.Provider value={{
      galaxy, 
      setGalaxy,
      queryOptions, 
      setQueryOptions
      }}>
      <Router history={history}>
        <Routes />
      </Router>
    </GalaxyContext.Provider>   
  );
}

export default App;
