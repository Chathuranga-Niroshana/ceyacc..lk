import React, { useState } from 'react';
import AuthHeader from '../../components/layout/AuthHeader';
import loginImage from '../../assets/images/authPages/loginPageImage.png';
import InputField from '../../components/input/InputField';
import CheckboxField from '../../components/input/CheckboxField';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import MainButton from '../../components/button/MainButton';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
    alpha,
    Stack
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';

const Login = () => {
    const dispatch = useDispatch()

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData({
            ...loginData,
            [name]: type === 'checkbox' ? checked : value,
        });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!loginData.password) {
            newErrors.password = 'Password is required';
        } else if (loginData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setIsLoading(true);
            setErrors({});
            const data = {
                "email": loginData.email,
                "password": loginData.password
            }
            const response = dispatch(login(data));
            console.log(response)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            elevation={16}
            sx={{
                minHeight: { xs: 'auto', md: '600px', },
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12)',
                position: 'relative'
            }}
        >
            {/* Left side - Login Form */}
            <Box
                sx={{
                    flex: 1,
                    p: { xs: 3, sm: 4, md: 6 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <AuthHeader header="Welcome Back" />

                    <Typography
                        variant="body1"
                        sx={{
                            mt: 2,
                            mb: 4,
                            color: 'text.secondary',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                        }}
                    >
                        Sign in to your account to discover amazing learning opportunities and share your achievements with the world.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <InputField
                            id="email"
                            label="Email Address"
                            placeholder="Enter your email address"
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: errors.email ? '#d32f2f' : '#BA0A0C' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        boxShadow: `0 4px 12px ${alpha('#BA0A0C', 0.15)}`,
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: `0 4px 20px ${alpha('#BA0A0C', 0.25)}`,
                                        '& fieldset': {
                                            borderColor: '#BA0A0C',
                                            borderWidth: 2
                                        }
                                    }
                                }
                            }}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: errors.password ? '#d32f2f' : '#BA0A0C' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            sx={{ color: '#BA0A0C' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        boxShadow: `0 4px 12px ${alpha('#BA0A0C', 0.15)}`,
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: `0 4px 20px ${alpha('#BA0A0C', 0.25)}`,
                                        '& fieldset': {
                                            borderColor: '#BA0A0C',
                                            borderWidth: 2
                                        }
                                    }
                                }
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 4,
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 2, sm: 0 }
                            }}
                        >
                            <CheckboxField
                                id="rememberMe"
                                label="Remember me for 30 days"
                                checked={loginData.rememberMe}
                                onChange={handleChange}
                                name="rememberMe"
                                sx={{
                                    '& .MuiCheckbox-root': {
                                        color: '#BA0A0C',
                                        '&.Mui-checked': {
                                            color: '#BA0A0C',
                                        }
                                    }
                                }}
                            />

                            <Link
                                to="/forgot-password"
                                style={{
                                    textDecoration: 'none',
                                    color: '#BA0A0C',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    borderBottom: '1px solid transparent'
                                }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>

                        <MainButton
                            label={isLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    Signing in...
                                </Box>
                            ) : (
                                'Sign In'
                            )}
                            id="login-button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            fullWidth
                            size="large"
                            sx={{
                                mb: 4,
                                py: 1.8,
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #BA0A0C 0%, #8B0000 100%)',
                                boxShadow: `0 8px 24px ${alpha('#BA0A0C', 0.3)}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8B0000 0%, #BA0A0C 100%)',
                                    boxShadow: `0 12px 32px ${alpha('#BA0A0C', 0.4)}`,
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: '#e0e0e0',
                                    color: '#9e9e9e',
                                    boxShadow: 'none',
                                    transform: 'none'
                                }
                            }}
                        />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '1rem'
                                }}
                            >
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    style={{
                                        textDecoration: 'none',
                                        color: '#BA0A0C',
                                        fontWeight: 600,
                                        transition: 'all 0.3s ease',
                                        borderBottom: '1px solid transparent'
                                    }}
                                >
                                    Create an account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Right side - Image */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >

                <Box
                    component="img"
                    src={loginImage}
                    alt="Welcome back to learning"
                    sx={{
                        width: '85%',
                        height: '85%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.02)'
                        }
                    }}
                />
            </Box>
        </Stack>
    );
};

export default Login;