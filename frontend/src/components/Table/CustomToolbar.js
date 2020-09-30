import React from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar,
} from '@material-ui/core';


function CustomToolbar({ children, toolbarChildren }) {
  return (
    <Toolbar>
      {toolbarChildren}
      {children}
    </Toolbar>
  );
}

CustomToolbar.propTypes = {
  children: PropTypes.shape({
    $$typeof: PropTypes.symbol,
    props: PropTypes.shape({ name: PropTypes.string }),
    type: PropTypes.func,
  }).isRequired,
  toolbarChildren: PropTypes.shape({
    $$typeof: PropTypes.symbol,
    props: PropTypes.shape({ name: PropTypes.string }),
    type: PropTypes.func,
  }).isRequired,
};

export default CustomToolbar;
