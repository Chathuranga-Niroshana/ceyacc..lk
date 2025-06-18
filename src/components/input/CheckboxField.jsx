import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.palette.getContrastText('#BA0A0C'),
    '&:hover': {
        backgroundColor: '#BA0A0C',
    },
    '&.Mui-checked': {
        color: '#BA0A0C',
    },
}));

const CheckboxField = ({
    id,
    label,
    checked,
    onChange,
    name,
    value,
    color = 'primary',
    disabled = false,
    error = false,
    helperText = '',
    ...props
}) => {
    return (
        <FormControl error={error} component="fieldset" variant="standard">
            <FormControlLabel
                control={
                    <StyledCheckbox
                        color={color}
                        id={id}
                        checked={checked}
                        onChange={onChange}
                        name={name}
                        value={value}
                        disabled={disabled}
                        {...props}
                    />
                }
                label={label}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default CheckboxField;