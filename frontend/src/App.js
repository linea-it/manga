import React, {useState} from 'react';
import { 
  BrowserRouter,
  Routes,
  Route,
  Link, Outlet } from 'react-router-dom';
import ReactGA from 'react-ga';
import AppRoutes from './routes';
import history from './services/history';
import { GalaxyContext } from './contexts/GalaxyContext';
import Galaxies from './pages/Galaxies';
import Preview from './pages/Preview';
import Explorer from './pages/Explorer';
import Header from './components/Header';
import HeaderHome from './components/LandingPage/Header';
import Footer from './components/LandingPage/Footer';
import Home from './pages/LandingPage/Home';
import AboutUs from './pages/LandingPage/AboutUs';
import Help from './pages/LandingPage/Help';
import Tutorials from './pages/LandingPage/Tutorials';
import Contact from './pages/LandingPage/Contact';
// import light from './themes/light';


// ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

// history.listen((location) => {
//   ReactGA.set({ page: location.pathname }); // Update the user's current page
//   ReactGA.pageview(location.pathname); // Record a pageview for the given page
// });

const AppLayout = () => (
  <>
    <Header />
    {/* TODO: Adicionar Classe a essa div main */}
    <main>
      <div>
        <Outlet /> 
      </div>
    </main>
  </>
);

const LandingPageLayout = () => (
  <>
    <HeaderHome />
    <main>
      <div>
        <Outlet /> 
      </div>
    </main>
    <Footer />
  </>
);


const routesConfig = [
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  {
    element: <LandingPageLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/help",
        element: <Help />,
      },
      {
        path: "/tutorials",
        element: <Tutorials />,
      },
      {
        path: "/contact-us",
        element: <Contact />,
      },                           
    ],
  },  
  {
    element: <AppLayout />,
    children: [
      {
        path: "/preview",
        element: <Preview />,
      },
      {
        path: "/explorer/:id/",
        element: <Explorer />,
      },            
      {
        path: "/galaxies",
        element: <Galaxies />,
      },
    ],
  },
];

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter(routesConfig);

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
      <RouterProvider router={router} />
    </GalaxyContext.Provider>   
  );
}

export default App;
