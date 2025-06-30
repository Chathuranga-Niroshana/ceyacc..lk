/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import AuthHeader from '../../components/layout/AuthHeader';
import registerImage from '../../assets/images/authPages/registerImg.png';
import InputField from '../../components/input/InputField';
import RadioButton from '../../components/input/RadioButton';
import MainButton from '../../components/button/MainButton';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    Avatar,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { genders } from '../../data/genders';
import { roles } from '../../data/roles';

const RegisterOne = ({ nextPage, userType, setUserType, userData, setUserData, errors, setErrors }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleRoleChange = (e) => {
        setUserType(e.target.value);
        setUserData(prev => ({
            ...prev,
            role: e.target.value
        }));
    };


    const handleSexChange = (e) => {
        setUserData(prev => ({
            ...prev,
            sex: e.target.value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^\d{10}$/;

        if (!userData.name) newErrors.name = 'Name is required';
        if (!userData.email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(userData.email)) newErrors.email = 'Invalid email format';

        if (!userData.password) newErrors.password = 'Password is required';
        else if (userData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

        if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!userData.mobileNo) newErrors.mobileNo = 'Mobile number is required';
        else if (!mobileRegex.test(userData.mobileNo)) newErrors.mobileNo = 'Invalid mobile format (10 digits)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            nextPage();
        } else {
            console.log('Form has errors');
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
            >
                <Grid container>
                    {/* Left side - Registration Form */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            order: { xs: 2, md: 1 },
                            borderRight: { md: `1px solid ${theme.palette.divider}` }
                        }}
                    >
                        <Box
                            sx={{
                                p: { xs: 3, sm: 4, md: 5 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Mobile view header */}
                            {isMobile && (
                                <Box sx={{ mb: 3, textAlign: 'center' }}>
                                    <AuthHeader header="Sign Up" />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mt: 1
                                        }}
                                    >
                                        Create your account to discover great learning opportunities,
                                        and share your achievements with the world.
                                    </Typography>
                                </Box>
                            )}

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    width: '100%',
                                    maxWidth: '450px',
                                    mx: 'auto'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            src={userData.image}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: '2px solid #BA0A0C',
                                                boxShadow: '0 4px 12px rgba(186, 10, 12, 0.15)'
                                            }}
                                            alt={userData.name || 'Profile'}
                                        />
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="image-upload"
                                            type="file"
                                            onChange={handleImageUpload}
                                        />
                                        <label htmlFor="image-upload">
                                            <IconButton
                                                component="span"
                                                sx={{
                                                    bgcolor: 'white',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    padding: '6px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                    '&:hover': {
                                                        bgcolor: '#f8f9fa'
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <CloudUpload sx={{ color: '#BA0A0C' }} />
                                            </IconButton>
                                        </label>
                                    </Box>
                                </Box>

                                <InputField
                                    id="name"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    name="name"
                                    value={userData.name || ''}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <InputField
                                    id="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    type="email"
                                    name="email"
                                    value={userData.email || ''}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <Grid
                                    container
                                    fullWidth
                                    spacing={2}
                                    sx={{
                                        mb: 3,
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Grid item xs={12} sm={6}>
                                        <InputField
                                            id="password"
                                            label="Password"
                                            placeholder="Enter password"
                                            type="password"
                                            name="password"
                                            value={userData.password || ''}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputField
                                            id="confirmPassword"
                                            label="Confirm Password"
                                            placeholder="Confirm password"
                                            type="password"
                                            name="confirmPassword"
                                            value={userData.confirmPassword || ''}
                                            onChange={handleChange}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            fullWidth
                                            required
                                            sx={{
                                                // width: '50%',
                                                // backgroundColor: '#000',
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <InputField
                                    id="mobileNo"
                                    label="Mobile Number"
                                    placeholder="Enter your mobile number"
                                    name="mobileNo"
                                    value={userData.mobileNo || ''}
                                    onChange={handleChange}
                                    error={!!errors.mobileNo}
                                    helperText={errors.mobileNo}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ mb: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                    >
                                        Sex:
                                    </Typography>
                                    <RadioButton
                                        list={genders}
                                        value={userData.sex}
                                        onChange={handleSexChange}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 1.5,
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                    >
                                        I am a:
                                    </Typography>
                                    <RadioButton
                                        list={roles}
                                        value={userType}
                                        onChange={handleRoleChange}
                                    />
                                </Box>

                                <MainButton
                                    label="Next"
                                    type="submit"
                                    id="register-button"
                                    onClick={handleSubmit}
                                    fullWidth
                                    size="large"
                                    sx={{
                                        mb: 1,
                                        py: 1.5,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(186, 10, 12, 0.25)',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(186, 10, 12, 0.3)'
                                        }
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mt: 1 }}
                                >
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        style={{
                                            textDecoration: 'none',
                                            color: '#BA0A0C',
                                            fontWeight: 'bold',
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        Login
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right side - Image and text */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            order: { xs: 1, md: 2 },
                            position: 'relative',
                            backgroundColor: '#f9f9f9',
                            height: '100%',
                            overflow: 'hidden',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 5
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
                            <AuthHeader header="Sign Up" />

                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    my: 3,
                                    lineHeight: 1.6
                                }}
                            >
                                Create your account to discover great learning opportunities,
                                and share your achievements with the world.
                            </Typography>

                            <Box
                                component="img"
                                src={registerImage}
                                alt="Register"
                                sx={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    objectFit: 'contain',
                                    display: 'block',
                                    mx: 'auto',
                                    mt: 2
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default RegisterOne;