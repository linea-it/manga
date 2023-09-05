import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { GalaxyContext } from '../../contexts/GalaxyContext';



export default function GalaxyPreview() {

  const {galaxyId} = useContext(GalaxyContext)
  return (
    <Box>
      {galaxyId}
    </Box>
  );

}
GalaxyPreview.defaultProps = {
}
GalaxyPreview.propTypes = {
};