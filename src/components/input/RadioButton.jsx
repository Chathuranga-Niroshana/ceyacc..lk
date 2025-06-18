/* eslint-disable no-unused-vars */
import React from 'react';
import {
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled radio
const StyledRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: '#e53e3e',
    },
    padding: '8px',
}));

// Custom styled form control label
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    marginRight: theme.spacing(4),
    '& .MuiFormControlLabel-label': {
        fontWeight: 500,
    },
}));

const RadioButton = ({ list, value, onChange }) => {
    return (
        <FormControl component="fieldset">
            <RadioGroup
                row
                name="role"
                value={value}
                onChange={onChange}
                sx={{ display: 'flex', flexWrap: 'wrap' }}
            >
                {list.map((item) => (
                    <Box
                        key={item.value}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 2,
                            bgcolor: value === item.value ? 'rgba(229, 62, 62, 0.1)' : 'transparent',
                            borderRadius: 2,
                            px: 1,
                            transition: 'all 0.2s',
                            border: value === item.value ? '1px solid #e53e3e' : '1px solid transparent',
                        }}
                    >
                        <StyledFormControlLabel
                            value={item.value}
                            control={<StyledRadio />}
                            label={item.label}
                        />
                    </Box>
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default RadioButton;