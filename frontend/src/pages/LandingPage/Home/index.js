import React from 'react';
import Banner from '../../../components/LandingPage/Banner';
import Interfaces from './partials/Interfaces';
import Supporters from './partials/Supporters';
import Description from './partials/Description';
import styles from './styles';

function Main() {
  const classes = styles();

  return (
    <>
      <Banner />
      <div className={classes.root}>
        <Interfaces />
        <Description />
        <Supporters />
      </div>
    </>
  );
}

export default Main;
