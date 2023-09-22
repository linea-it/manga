import React from 'react';
import Banner from '../../../components/LandingPage/Banner';
import Interfaces from './partials/Interfaces';
import Supporters from './partials/Supporters';
import Description from './partials/Description';
// import styles from './styles';
import { Box } from '@mui/material';

function Main() {
  // const classes = styles();

  return (
    <>
      <Banner />
        <Box mb={10} sx={{padding:'0 5%'}}>
          <Interfaces />
          <Description />
          <Supporters />
        </Box>
    </>
  );
}

export default Main;
