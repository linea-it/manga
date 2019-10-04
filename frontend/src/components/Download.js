import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function Download({ setTitle }) {
  useEffect(() => {
    setTitle('Download');
  }, [setTitle]);

  return (
    <span>Download</span>
  );
}

Download.propTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default Download;
