import React from 'react';
import PropTypes from 'prop-types';
import { BaseSlider } from '../Slider';

export default function ColorRange(props) {
  const {min, max, value, onChange, disabled} = props

  const step = max / 100

  return (
    <BaseSlider
        size="small"
        orientation="vertical"
        valueLabelDisplay="off"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
        disabled={disabled}
    />
  )
}

ColorRange.defaultProps = {
  min: 0,
  max: 100,
  value: [],
  disabled: false
}

ColorRange.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.number.isRequired
  ]),
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  disabled: PropTypes.bool,
};
