import React from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';


function Inputs({
  selectedMegacube,
  handleSelectMegacube,
  megacubeList,
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Card>
          <CardHeader
            title={<span>Inputs</span>}
          />
          <CardContent>
            <form autoComplete="off">
              <FormControl fullWidth>
                <InputLabel htmlFor="input">Megacube</InputLabel>
                <Select
                  value={selectedMegacube}
                  onChange={handleSelectMegacube}
                >
                  {megacubeList.map((megacube) => (
                    <MenuItem
                      key={megacube}
                      value={megacube}
                    >
                      {megacube}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Inputs;
