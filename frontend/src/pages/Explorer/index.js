import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query'
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import ExplorerToolbar from './partials/Toolbar';
import LinearProgress from '@mui/material/LinearProgress';
import MegacubeHeader from '../../components/MegacubeHeader';
import MegacubeDownload from '../../components/MegacubeDownload'
import GenericError from '../../components/Alerts/GenericError';
import ExplorerImageLayout from './partials/ImageLayout';
import ExplorerGridLayout from './partials/GridLayout';
import { getGalaxyById } from '../../services/api';

function Explorer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [headerIsOpen, setHeaderIsOpen] = React.useState(false)
  const [downloadIsOpen, setDownloadIsOpen] = React.useState(false)
  const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  const [isGrid, setIsGrid] = React.useState(false)

  const { data: galaxy, isLoading } = useQuery({
    queryKey: ['galaxyById', { id }],
    queryFn: getGalaxyById,
    keepPreviousData: true,
    refetchInterval: false,
    // refetchOnWindowFocus: false,
    // refetchOnmount: false,
    // refetchOnReconnect: false,
    retry: 1,
    staleTime: 1 * 60 * 60 * 1000,
    onError: () => { setErrorIsOpen(true) }
  })

  const handleBackNavigation = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // the current entry in the history stack will be replaced with the new one with { replace: true }
      navigate('/galaxies', { replace: true });
    }
  }

  const handleDownload = () => setDownloadIsOpen(!downloadIsOpen);

  const handleHeader = () => setHeaderIsOpen(!headerIsOpen);

  const closeError = () => setErrorIsOpen(false)

  const handleLayoutChange = () => setIsGrid((prev) => !prev);

  return (
    <Box>
      <Box>
        {isLoading && (<LinearProgress color="secondary" />)}
        {/* Progress Placeholder */}
        {!isLoading && (<Box height={4} />)}
        <ExplorerToolbar
          disabled={!galaxy}
          handleBackNavigation={handleBackNavigation}
          handleDownload={handleDownload}
          handleHeader={handleHeader}
          isGrid={isGrid}
          handleLayout={handleLayoutChange}
        />
      </Box>
      <Box ml={3} mr={3}>
        {!isGrid && galaxy && (<ExplorerImageLayout galaxy={galaxy} />)}
        {isGrid && galaxy && (<ExplorerGridLayout galaxy={galaxy} />)}

        {/* Modal Windows */}
        {galaxy?.id && (
          <MegacubeHeader galaxyId={galaxy.id} open={headerIsOpen} onClose={handleHeader} />
        )}
        {galaxy?.id && (
          <MegacubeDownload galaxyId={galaxy.id} open={downloadIsOpen} onClose={handleDownload} />
        )}
        <GenericError open={errorIsOpen} onClose={closeError} />
      </Box>
    </Box>
  );
}

export default Explorer;
