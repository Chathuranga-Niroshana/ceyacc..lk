import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import logo from '../../assets/images/logo.png';
import { Box, Typography } from '@mui/material';

const AuthHeader = ({ header = "Login" }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
            }}
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="CeyAcc.lk Logo"
                        sx={{
                            height: 40,
                            mr: 1,
                        }}
                    />
                    <Typography
                        variant="h5"
                        component="span"
                        sx={{
                            fontWeight: 'bold',
                            color: '#BA0A0C',
                        }}
                    >
                        CeyAcc.lk
                    </Typography>
                </Box>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#1A202C',
                    }}
                >
                    {header}
                </Typography>
            </motion.div>
        </Box>
    );
};

export default AuthHeader;