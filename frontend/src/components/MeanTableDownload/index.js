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
import { getMeanTableDownloadInfo } from '../../services/api';
import GenericError from '../Alerts/GenericError';

function MeanTableDownload({ open, onClose }) {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['meanTableDownloadInfo'],
    queryFn: getMeanTableDownloadInfo,
    enabled: open,
    keepPreviousData: true,
    staleTime: 1 * 60 * 60 * 1000,
  })

  function generate_skeleton(element) {
    return [0, 1,].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

  if (isError) return (
    <GenericError open={open} onClose={onClose} />
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="mean-table-download"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>Download Mean Properties</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          generate_skeleton(<Skeleton animation="wave" height={40} />)
        )}
        {data && (
          <>
            <Typography><strong>File:</strong>{' '}{data.filename}</Typography>
            <Typography><strong>Download Size:</strong>{' '}{filesize(data.filesize)}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          href={data?.url}
          onClick={onClose}
          disabled={!data}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}
MeanTableDownload.defaultProps = {
  open: false,
}

MeanTableDownload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default MeanTableDownload;
