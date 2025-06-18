/* eslint-disable no-unused-vars */
import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: '#BA0A0C',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#BA0A0C',
        },
    },
}));

const InputField = ({
    id,
    label,
    placeholder,
    multiline,
    value,
    onChange,
    type,
    name,
    error,
    helperText,
    fullWidth = true,
    required = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isPasswordField = type === 'password';

    return (
        <StyledTextField
            id={id}
            label={label}
            placeholder={placeholder}
            multiline={multiline}
            value={value}
            onChange={onChange}
            type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
            error={error}
            helperText={helperText}
            variant="outlined"
            fullWidth={fullWidth}
            required={required}
            name={name}
            InputProps={{
                endAdornment: isPasswordField ? (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
            {...props}
        />
    );
};

export default InputField;