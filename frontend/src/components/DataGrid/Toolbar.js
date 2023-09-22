import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';


const handleDownload = () => {
  const link = document.createElement("a");
  link.download = `megacube_mean_properties_table_Riffel_2023.fits.tar.gz`;
  link.href = "/table/megacube_mean_properties_table_Riffel_2023.fits.tar.gz";
  link.click();
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter debounceMs={600} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Button
        onClick={handleDownload}
        startIcon={<DownloadIcon />}>Download mean properties file</Button>
    </GridToolbarContainer>
  );
}
export default CustomToolbar;
