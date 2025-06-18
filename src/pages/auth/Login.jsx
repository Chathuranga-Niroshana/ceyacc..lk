import React, { useState } from 'react';
import AuthHeader from '../../components/layout/AuthHeader';
import loginImage from '../../assets/images/authPages/loginPageImage.png';
import InputField from '../../components/input/InputField';
import CheckboxField from '../../components/input/CheckboxField';
import { Email, Password, VpnKey } from '@mui/icons-material';
import MainButton from '../../components/button/MainButton';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData({
            ...loginData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Data:', loginData);
        // Here you would typically make an API call for authentication
    };

    return (
        <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                <Grid container>


                    {/* left side - Login Form */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                p: { xs: 3, sm: 6 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <AuthHeader header="Login" />

                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 2,
                                    mb: 4,
                                    color: 'text.secondary',
                                    textAlign: 'center'
                                }}
                            >
                                Login to your account to discover great learning opportunities, and share your achievements with the world.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <InputField
                                    id="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    error={false}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <InputField
                                    id="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                    type="password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    error={false}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <VpnKey color="action" sx={{ mr: 1 }} />,
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3,
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: { xs: 1, sm: 0 }
                                    }}
                                >
                                    <CheckboxField
                                        id="rememberMe"
                                        label="Remember me"
                                        checked={loginData.rememberMe}
                                        onChange={handleChange}
                                        name="rememberMe"
                                    />

                                    <Link
                                        to="/forgot-password"
                                        style={{
                                            textDecoration: 'none',
                                            color: '#BA0A0C',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </Box>

                                <MainButton
                                    label="Login"
                                    id="login-button"
                                    onClick={handleSubmit}
                                    fullWidth
                                    size="large"
                                    sx={{ mb: 3 }}
                                />

                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mt: 2 }}
                                >
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        style={{
                                            textDecoration: 'none',
                                            color: '#BA0A0C',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Register
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    {/* right side - Image */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'relative'
                        }}
                    >
                        <Box
                            component="img"
                            src={loginImage}
                            alt="Login"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Login;