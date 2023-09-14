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
import filesize from 'filesize';
import Skeleton from '@mui/lab/Skeleton';
import { useQuery } from 'react-query'
import { getMegacubeDownloadInfo } from '../../services/api';
import GenericError from '../Alerts/GenericError';

function MegacubeDownload({galaxyId, open, onClose  }) {
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['megacubeDownloadById', { id: galaxyId }],
    queryFn: getMegacubeDownloadInfo,
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
      aria-labelledby="megacube-download"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>Download Megacube</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          generate_skeleton(<Skeleton animation="wave" height={40}/>)
        )}
        {data && (
          <>
            <Typography><strong>Common Name:</strong>{' '} {data.name}</Typography>          
            <Typography><strong>MaNGA ID:</strong>{' '}{data.mangaid}</Typography>
            <Typography><strong>File:</strong>{' '}{data.megacube}</Typography>
            <Typography><strong>Download Size:</strong>{' '}{filesize(data.compressed_size)}</Typography>
            {data?.bcomp_name && (
                <Typography><strong>Broad component:</strong>{' '}{data.bcomp_name}</Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onClose}  sx={{ mr: 1 }}>
          Cancel
        </Button>
        {data?.link_bcomp && (
          <Button 
            variant="contained" 
            color="primary" 
            href={data?.link_bcomp} 
            onClick={onClose}>
            Download Broad component
          </Button>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          href={data?.link} 
          onClick={onClose}
          disabled={!data}
          >
          Download
        </Button>
      </DialogActions>  
    </Dialog>
  )
}
MegacubeDownload.defaultProps = {
  galaxyId: undefined,
  open: false,
}

MegacubeDownload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  galaxyId: PropTypes.number,
};


export default MegacubeDownload;