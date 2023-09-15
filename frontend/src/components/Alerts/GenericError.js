import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog} from '@mui/material'
import { Alert, AlertTitle } from '@mui/lab';

function GenericError({open, onClose}) {
    return (
    <Dialog
        open={open}
        onClose={onClose}>
        <Alert severity="error" onClose={onClose}>
          <AlertTitle>Oops! Something went wrong!</AlertTitle>
            Please try again and if the problem persists help us improve your experience by sending an error report.
        </Alert>
      </Dialog>
    )
}
GenericError.defaultProps = {
galaxyId: undefined,
open: false,
}

GenericError.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GenericError;
