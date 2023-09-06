import React, { useContext } from 'react';
// import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { GalaxyContext } from '../../contexts/GalaxyContext';



export default function GalaxyPreview() {
  // const navigate = useNavigate();
  const {galaxy} = useContext(GalaxyContext)
  
  // const handleExplorerClick = () => {
  //   navigate(`/explorer/${galaxy.id}`);
  // };

  return (
      <Card sx={{height: '100%'}}>
        <CardHeader 
          title={galaxy?.ned_name}
          // titleTypographyProps
          action={
            <Button
              variant="contained"
              color="primary"
              disabled={!galaxy?.id}
              // onClick={handleExplorerClick}
            >Explorer</Button>
          }
          ></CardHeader>
          <Divider variant="middle" />
        <CardContent></CardContent>
      </Card>                 
    );

}
GalaxyPreview.defaultProps = {
}
GalaxyPreview.propTypes = {
};