import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Unstable_Grid2';
import GalaxyList from './List';
import { Card, CardContent } from '@mui/material';
import GalaxyPreview from './Preview';


function Galaxies() {
  const history = useHistory();
  const [isLoading, setisLoading] = React.useState(false)

  return (
    <Box 
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      sx={{
        backgroundColor: 'green',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        minHeight: '400px'
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
        // ml={2}
        // mr={2}
        sx={{
          // overflow: "auto", 
          overflow:"auto",          
          height: '100%',
        }}>
        <Grid 
          xs={8} 
          display={"flex"} 
          flexDirection={"column"} 
          sx={{minWidth: '560px'}}>
            <Card sx={{height: '100%'}}>
              <CardContent>
                <GalaxyList></GalaxyList>
              </CardContent>
            </Card>
         </Grid>
         <Grid 
          xs={4} 
          display={"flex"} 
          flexDirection={"column"} 
          sx={{minWidth: '400px'}}>
            <Card sx={{height: '100%'}}>
              <CardContent>
                <GalaxyPreview></GalaxyPreview>
              </CardContent>
            </Card>            
         </Grid>
      </Grid>
    </Box>
  );
}

export default Galaxies;