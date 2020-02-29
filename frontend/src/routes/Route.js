import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Drawer from '../components/Drawer';

export default function RouteWrapper({
  component: Component,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Drawer>
          <Component {...props} />
        </Drawer>
      )}
    />
  );
}


RouteWrapper.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};
