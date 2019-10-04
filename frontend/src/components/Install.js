import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function Install({ setTitle }) {
  useEffect(() => {
    setTitle('Install');
  }, [setTitle]);

  return (
    <span>Install</span>
  );
}

Install.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default Install;
