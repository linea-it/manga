import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getHdus } from '../../services/api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  infoIcon: {
    marginLeft: theme.spacing(1),
    color: 'rgba(0, 0, 0, .5)',
  },
  select: {
    '& svg': {
      display: 'none',
    },
  },
}));

function HduSelect(props) {
  const classes = useStyles();

  const { galaxyId, inputLabel, selected, onChange, allowEmpty } = props

  const { data, isLoading } = useQuery({
    queryKey: ['HdusByGalaxyId', { id: galaxyId }],
    queryFn: getHdus,
    keepPreviousData: true,
    refetchInterval: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  function menu_item(items) {
    return items.map((hdu) => (
      <MenuItem
        key={hdu.internal_name}
        title={hdu.comment}
        value={hdu.internal_name}
      >
        {hdu.display_name}
        <InfoIcon
          fontSize="small"
          className={classes.infoIcon}
        />
      </MenuItem>
    )
    );
  }

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      fullWidth
      size="small">
      <InputLabel htmlFor={`select-image-${inputLabel}`}>{inputLabel}</InputLabel>
      <Select
        value={selected}
        onChange={handleChange}
        disabled={isLoading}
        label={inputLabel}
        classes={{ select: classes.select }}
        inputProps={{
          id: `select-image-${inputLabel}`,
        }}
      >
        {allowEmpty && (<MenuItem value=""><em>None</em></MenuItem>)}

        {data?.stellar_maps.length > 0 && (
          menu_item(data.stellar_maps)
        )}
        {data?.gas_maps.length > 0 && (
          menu_item(data.gas_maps)
        )}
      </Select>
    </FormControl>
  )
}
HduSelect.defaultProps = {
  galaxyId: undefined,
  inputLabel: 'Type',
  selected: '',
  allowEmpty: false
}

HduSelect.propTypes = {
  galaxyId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  inputLabel: PropTypes.string,
  selected: PropTypes.string,
  allowEmpty: PropTypes.bool
};

export default HduSelect;