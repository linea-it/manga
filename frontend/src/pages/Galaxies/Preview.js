import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, CardMedia, Divider } from '@mui/material';
import { GalaxyContext } from '../../contexts/GalaxyContext';
import Heatmap from '../../components/Map/Heatmap';


export default function GalaxyPreview() {
  const navigate = useNavigate();
  const {galaxy} = useContext(GalaxyContext)
  const DEFAULT_HDU = 'f_norm'
  
  const handleExplorerClick = () => {
    navigate(`/explorer/${galaxy.id}`);
  };

  return (
      <Card sx={{height: '100%'}}>
        <CardHeader 
          title={galaxy?.ned_name}
          titleTypographyProps={{variant:'h6', fontSize: '1rem', }}
          action={
            <Button
              variant="contained"
              color="primary"
              disabled={!galaxy?.id}
              onClick={handleExplorerClick}
            >Explorer</Button>
          }
          ></CardHeader>
          <CardContent>
            <Box height={200}>
            <Heatmap 
                galaxyId={galaxy?.id}
                mapHdu={{DEFAULT_HDU}}

              />
            </Box>
          </CardContent>
          {/* <CardMedia
          sx={{ height: 140 }}
          image={galaxy?.sdss_image} /> */}

          <Divider variant="middle" />
        <CardContent></CardContent>
      </Card>                 
    );

}
GalaxyPreview.defaultProps = {
}
GalaxyPreview.propTypes = {
};