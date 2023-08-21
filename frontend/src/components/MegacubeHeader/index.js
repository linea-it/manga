import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import Skeleton from '@mui/lab/Skeleton';
import { useQuery } from 'react-query'
import { getMegacubeHeadersById } from '../../services/api';
import GenericError from '../Alerts/GenericError';

function MegacubeHeader({galaxyId, open, onClose  }) {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['megacubeHeadersById', { id: galaxyId }],
    queryFn: getMegacubeHeadersById,
    enabled: open,
    keepPreviousData: true,
    staleTime: 1 * 60 * 60 * 1000,    
  })

  function generate_skeleton(element) {
    return [0, 1, 2, 3, 4].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

  if (isError) return (
    <GenericError open={open} onClose={onClose}/>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="megacube-header"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>Megacube Header</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          generate_skeleton(<Skeleton animation="wave" height={40}/>)
        )}
        {data?.map(row => (
          <Typography key={row} paragraph>{row}</Typography>
        ))}
      </DialogContent>
      <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
      </DialogActions>      
    </Dialog>
  )
}
MegacubeHeader.defaultProps = {
  galaxyId: undefined,
  open: false,
}

MegacubeHeader.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  galaxyId: PropTypes.number,
};


export default MegacubeHeader;
