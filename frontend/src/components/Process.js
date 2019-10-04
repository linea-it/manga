import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function Process({ setTitle }) {
  useEffect(() => {
    setTitle('Process');
  }, [setTitle]);

  return (
    <span>Process</span>
  );
}

Process.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default Process;
