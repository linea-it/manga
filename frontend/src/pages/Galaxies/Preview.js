import React, { useContext, useRef } from 'react';
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

  const imageContainerRef = useRef();

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={galaxy?.ned_name}
        titleTypographyProps={{ variant: 'h6', fontSize: '1rem', }}
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
      <CardContent sx={{
        height: 'calc(100% - 95px)',
        overflowY: 'auto'
      }} >
        <Box
          height={"100%"}
          display="flex"
          flexDirection="column"
          sx={{
            // backgroundColor: 'gray',
            justifyContent: "flex-start",
            alignItems: "stretch",
            flexWrap: "nowrap"
          }}
        >
          <Box
            flex={1}
            mb={1}
            minHeight={{
              md: 190,
              lg: 210,
              xl: 460
            }}
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
            ref={imageContainerRef}
            sx={{
              // backgroundColor: "cyan",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Box
              minHeight={{
                md: 180,
                lg: 200,
                xl: 400
              }}
              minWidth={{
                md: 180,
                lg: 200,
                xl: 400
              }}
              flex={1}
            // sx={{
            //   backgroundColor: "gray",
            // }}
            >
              <img
                src={galaxy?.sdss_image}
                loading="lazy"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: "50%",
                  width: "50%",
                  objectFit: "contain"
                }}
              />
            </Box>
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
