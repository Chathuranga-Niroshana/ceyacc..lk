import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectField = ({
    list = [],
    label,
    value,
    onChange,
    disabled = false
}) => {
    return (
        <Autocomplete
            disablePortal
            id={`select-${label}`}
            options={list}
            value={value}
            onChange={onChange}
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required
                    fullWidth
                />
            )}
            noOptionsText="No options available"
        />
    );
};

export default SelectField;