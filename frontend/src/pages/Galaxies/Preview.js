import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, CardMedia, Divider, Stack } from '@mui/material';
import { GalaxyContext } from '../../contexts/GalaxyContext';
import SingleHeatmap from '../../components/Map/SingleHeatmap';


export default function GalaxyPreview() {
  const navigate = useNavigate();
  const { galaxy } = useContext(GalaxyContext)
  const DEFAULT_HDU = 'f_norm'

  const handleExplorerClick = () => {
    navigate(`/explorer/${galaxy.id}`);
  };

  return (
    <Card sx={{
      // height: '100%' 
      // flex: 1
      }}>
      <CardHeader
        title={galaxy?.ned_name}
        // subheader={galaxy?.plateifu}
        titleTypographyProps={{ variant: 'h6', fontSize: '1rem', }}
        // subheaderTypographyProps={{ variant: 'subtitle1', fontSize: '1rem', }}
        action={
          <Button
            variant="contained"
            color="primary"
            disabled={!galaxy?.had_parts_extracted}
            onClick={handleExplorerClick}
          >Explorer</Button>
        }
      >
      </CardHeader>
      <CardContent sx={{height: '100%', overflowY: 'auto'}} >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            // backgroundColor: 'gray',
            // height: '100%',
            justifyContent: "flex-start",
            alignItems: "stretch",
            flexWrap: "nowrap"
          }}
        >
          <Box
            flex={1}         
            minHeight={190}
            mb={2}
            // sx={{ backgroundColor: "blue" }}
            >
            {galaxy.id !== undefined &&
              (
                <SingleHeatmap
                  galaxyId={galaxy?.id}
                  mapHdu={DEFAULT_HDU}
                  enableRange={false}
                />
              )}
          </Box>
          <Box 
            flex={1} 
            height={200}
            mb={2}
            sx={{
            // backgroundColor: "cyan",
            position: "relative",
            justifyContent: "center",
            display:"flex",
            flexWrap:"nowrap",
          }}
          >
            {galaxy.id !== undefined && (
              <img
                src={galaxy?.sdss_image}
                loading="lazy"
                style={{
                  height: "180px",
                  width: "180px",
                  objectFit: "contain"
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

}
GalaxyPreview.defaultProps = {
}
GalaxyPreview.propTypes = {
};


{/* <CardContent>
<Stack spacing={2}>
  <Box height={200}>
    { galaxy.id !== undefined && 
    (
      <SingleHeatmap 
      galaxyId={galaxy?.id}
      mapHdu={DEFAULT_HDU}
    />
    )}
  </Box>
  <Divider variant="middle" />
<Box height={220} mt={2} mb={2}>
  {galaxy !== undefined && (
    <img 
      src={galaxy?.sdss_image} 
      loading="lazy" 
      style={{
        width:"220px",
        // maxWidth: "100%",
        height: "220px",
        // height: "auto",
        objectFit: "contain"
      }}/>
  )}
</Box>
</Stack> */}


{/* <Card sx={{maxHeight: '100%'}}>
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
  >        
  </CardHeader>
  {/* <CardContent sx={{height: '100%'}}> */}
{/* <CardContent sx={{ height: '100%', padding: "unset" }} >
  <Box
    display="flex"
    flexDirection="column"
    sx={{
      backgroundColor: 'gray',
      // height: 'calc(100% - 90px)',
      // height: '100%'
      height: "auto",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flexWrap: "nowrap"
    }}
  >
    <Box
      flex={1}
      minHeight={250}
      sx={{ backgroundColor: "blue" }}
      m={1}>
      {galaxy.id !== undefined &&
        (
          <SingleHeatmap
            galaxyId={galaxy?.id}
            mapHdu={DEFAULT_HDU}
          />
        )}
    </Box>
    <Box flex={1} sx={{
      backgroundColor: "cyan",
      position: "relative",
      justifyContent: "center"
    }}
      display="flex"
      flexWrap="nowrap"
      m={1}
    >
      {galaxy !== undefined && (
        <img
          src={galaxy?.sdss_image}
          loading="lazy"
          style={{
            height: "200px",
            width: "200px",
            objectFit: "contain"
          }}
        />
      )}
    </Box>
  </Box>
</CardContent> * /} */}
