import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Unstable_Grid2';
import GalaxyList from './List';
import { Card, CardContent } from '@mui/material';
import GalaxyPreview from './Preview';
import SingleHeatmap from '../../components/Map/SingleHeatmap';


function Galaxies() {
  const [isLoading, setisLoading] = React.useState(false)

  return (
    <Box 
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      sx={{
        // backgroundColor: 'green',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        minHeight: '400px',
        flexWrap: "nowrap"
      }}
      >
      <Box>
        {isLoading && (<LinearProgress color="secondary" />)}
        {/* Progress Placeholder */}
        {!isLoading && (<Box height={4} />)}
      </Box>
      <Grid 
        container 
        spacing={1} 
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        wrap="nowrap" 
        sx={{
          overflow:"auto",          
          height: '100%',
        }}>
        <Grid 
          xs={8} 
          display={"flex"} 
          flexDirection={"column"}
          sx={{
            alignItems: 'stretch',
            minWidth: '560px',
            flex: 1,
            mt: 2,
            mr: 1,
            mb: 1,
            ml: 2
          }}
            >
          <GalaxyList />
         </Grid>
         <Grid 
          xs={4} 
          display={"flex"} 
          flexDirection={"column"} 
          sx={{
            alignItems: 'stretch',
            minWidth: '400px',
            mt: 2,
            mr: 2,
            mb: 1,
            ml: 0
          }}
          >
            <GalaxyPreview />
         </Grid>
      </Grid>
    </Box>
  );
}

export default Galaxies;