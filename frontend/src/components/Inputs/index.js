import React from 'react';
import {
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
  );
}

export default Inputs;
