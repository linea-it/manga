import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Unstable_Grid2';
// import { styled } from '@mui/styles';
import Paper from '@mui/material/Paper'


// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   height: "100%"
// }));

function Galaxies() {
  const history = useHistory();
  const [isLoading, setisLoading] = React.useState(true)
//   const { data: galaxy, isLoading } = useQuery({
//     queryKey: ['galaxyById', { id }],
//     queryFn: getGalaxyById,
//     keepPreviousData: true,
//     refetchInterval: false,
//     // refetchOnWindowFocus: false,
//     // refetchOnmount: false,
//     // refetchOnReconnect: false,
//     retry: 1,
//     staleTime: 1 * 60 * 60 * 1000,
//     onError: () => { setErrorIsOpen(true) }
//   })

  return (
    <>
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
           <Item>1</Item>
         </Grid>
         <Grid 
          xs={4} 
          display={"flex"} 
          flexDirection={"column"} 
          sx={{minWidth: '400px'}}>
         </Grid>
      </Grid>
    </>
  );
}

export default Galaxies;
