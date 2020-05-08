import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

export default function RouteWrapper({
  component: Component,
  ...rest
}) {
  const [title, setTitle] = useState('');

  return (
    <Route
      {...rest}
      render={(props) => (
        <Component setTitle={setTitle} {...props} />
      )}
    />
  );
}


RouteWrapper.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
};
