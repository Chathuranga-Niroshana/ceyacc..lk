/* eslint-disable no-unused-vars */
import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const ColorButton = styled(Button)(({ theme }) => ({
    color: 'white',
    backgroundColor: '#BA0A0C',
    padding: '10px 20px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(186, 10, 12, 0.25)',
    '&:hover': {
        backgroundColor: '#90091A',
        boxShadow: '0 4px 8px rgba(186, 10, 12, 0.3)',
    },
}));

const MainButton = ({
    label,
    id,
    variant = "contained",
    color = "primary",
    size = "medium",
    disabled = false,
    onClick,
    loading = false,
    fullWidth = false,
    icon,
    ...props
}) => {
    return (
        <ColorButton
            id={id}
            variant={variant}
            size={size}
            disabled={disabled || loading}
            onClick={onClick}
            fullWidth={fullWidth}
            {...props}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : label}
        </ColorButton>
    );
};

export default MainButton;