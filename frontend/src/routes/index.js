import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Galaxies from '../pages/Galaxies';
// import Preview from '../pages/Preview';
import Explorer from '../pages/Explorer';
import Header from '../components/Header';
import HeaderHome from '../components/LandingPage/Header';
import Footer from '../components/LandingPage/Footer';
import Home from '../pages/LandingPage/Home';
import AboutUs from '../pages/LandingPage/AboutUs';
import Help from '../pages/LandingPage/Help';
import Tutorials from '../pages/LandingPage/Tutorials';
import Contact from '../pages/LandingPage/Contact';

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
      // {
      //   path: "/preview",
      //   element: <Preview />,
      // },
      {
        path: "/explorer/:id/",
        element: <Explorer />,
      },            
      {
        path: "/preview",
        element: <Galaxies />,
      },
    ],
  },
];


export const router = createBrowserRouter(routesConfig);