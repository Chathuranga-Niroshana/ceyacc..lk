/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AuthHeader from '../../components/layout/AuthHeader';
import forgetPasswordImage from '../../assets/images/authPages/fgtPssword.png';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Fade,
    CircularProgress,
    Grid,
} from '@mui/material';
import { KeyboardArrowRight, Email, VpnKey, LockReset } from '@mui/icons-material';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [showResendButton, setShowResendButton] = useState(false);
    const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
    const [message, setMessage] = useState({ type: '', text: '' });
    const [timerActive, setTimerActive] = useState(false);

    const [data, setData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });

    // Handle timer for resend OTP button
    useEffect(() => {
        let timer;
        if (timerActive && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setShowResendButton(true);
            setTimerActive(false);
        }

        return () => clearTimeout(timer);
    }, [countdown, timerActive]);

    // Format time for display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '', confirmPassword: '', otp: '' };

        if (!validateEmail(data.email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        if (activeStep === 0) {
            if (!validatePassword(data.password)) {
                newErrors.password = 'Password must be at least 8 characters';
                valid = false;
            }

            if (data.password !== data.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                valid = false;
            }
        }

        if (activeStep === 1 && !data.otp) {
            newErrors.otp = 'Please enter the OTP';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        // Simulate API call to send OTP
        setTimeout(() => {
            setLoading(false);
            setShowOtp(true);
            setActiveStep(1);
            setTimerActive(true);
            setMessage({
                type: 'success',
                text: 'OTP has been sent to your email address'
            });

            // Log the data
            console.log('Initial submission:', {
                email: data.email,
                password: data.password,
            });
        }, 1500);
    };

    const handleResendOTP = () => {
        setLoading(true);

        // Simulate API call to resend OTP
        setTimeout(() => {
            setLoading(false);
            setCountdown(180);
            setShowResendButton(false);
            setTimerActive(true);
            setMessage({
                type: 'info',
                text: 'OTP has been resent to your email address'
            });

            console.log('Resending OTP to:', data.email);
        }, 1500);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        // Simulate API call to verify OTP and reset password
        setTimeout(() => {
            setLoading(false);
            setActiveStep(2);
            setMessage({
                type: 'success',
                text: 'Password has been reset successfully!'
            });

            // Log the complete data
            console.log('Final submission:', {
                email: data.email,
                password: data.password,
                otp: data.otp
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }, 1500);
    };

    const steps = ['Email & Password', 'Verify OTP', 'Reset Complete'];

    return (
        <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                <Grid container>
                    {/* Left side - Form */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                p: { xs: 3, sm: 6 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <AuthHeader header="Reset Password" />

                            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {message.text && (
                                <Fade in={!!message.text}>
                                    <Alert
                                        severity={message.type}
                                        sx={{ mb: 3 }}
                                        onClose={() => setMessage({ type: '', text: '' })}
                                    >
                                        {message.text}
                                    </Alert>
                                </Fade>
                            )}

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    color: 'text.secondary',
                                    textAlign: 'center'
                                }}
                            >
                                {activeStep === 0 && "Enter your email and set a new password to reset your account."}
                                {activeStep === 1 && "Please enter the OTP sent to your email address."}
                                {activeStep === 2 && "Your password has been reset successfully."}
                            </Typography>

                            {activeStep < 2 && (
                                <Box component="form" onSubmit={activeStep === 0 ? handleInitialSubmit : handleFinalSubmit} sx={{ mt: 1 }}>
                                    {activeStep === 0 && (
                                        <>
                                            <InputField
                                                id="email"
                                                label="Email"
                                                placeholder="Enter your email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                fullWidth
                                                required
                                                InputProps={{
                                                    startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                                                }}
                                                sx={{ mb: 3 }}
                                            />

                                            <InputField
                                                id="password"
                                                label="New Password"
                                                placeholder="Enter your new password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                onChange={handleChange}
                                                error={!!errors.password}
                                                helperText={errors.password}
                                                fullWidth
                                                required
                                                InputProps={{
                                                    startAdornment: <LockReset color="action" sx={{ mr: 1 }} />,
                                                }}
                                                sx={{ mb: 3 }}
                                            />

                                            <InputField
                                                id="confirmPassword"
                                                label="Confirm Password"
                                                placeholder="Confirm your new password"
                                                type="password"
                                                name="confirmPassword"
                                                value={data.confirmPassword}
                                                onChange={handleChange}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword}
                                                fullWidth
                                                required
                                                InputProps={{
                                                    startAdornment: <VpnKey color="action" sx={{ mr: 1 }} />,
                                                }}
                                                sx={{ mb: 3 }}
                                            />
                                        </>
                                    )}

                                    {activeStep === 1 && (
                                        <Box sx={{ mb: 3 }}>
                                            <InputField
                                                id="otp"
                                                label="OTP"
                                                placeholder="Enter OTP"
                                                type="text"
                                                name="otp"
                                                value={data.otp}
                                                onChange={handleChange}
                                                error={!!errors.otp}
                                                helperText={errors.otp}
                                                fullWidth
                                                required
                                                sx={{ mb: 2 }}
                                            />

                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 1
                                            }}>
                                                {timerActive && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Resend OTP in: {formatTime(countdown)}
                                                    </Typography>
                                                )}

                                                {showResendButton && (
                                                    <MainButton
                                                        label="Resend OTP"
                                                        id="resend-otp"
                                                        onClick={handleResendOTP}
                                                        variant="outlined"
                                                        size="small"
                                                        loading={loading && showResendButton}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    )}

                                    <MainButton
                                        label={activeStep === 0 ? "Continue" : "Reset Password"}
                                        id={activeStep === 0 ? "continue-button" : "reset-button"}
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        loading={loading && !showResendButton}
                                        endIcon={<KeyboardArrowRight />}
                                        sx={{ mb: 3 }}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Link
                                            to="/login"
                                            style={{
                                                textDecoration: 'none',
                                                color: '#BA0A0C',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Remembered Password? Login
                                        </Link>
                                    </Box>
                                </Box>
                            )}

                            {activeStep === 2 && (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                        <Box
                                            sx={{
                                                bgcolor: '#e8f5e9',
                                                color: '#2e7d32',
                                                borderRadius: '50%',
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <LockReset fontSize="large" />
                                        </Box>
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        Password Reset Successful
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Your password has been reset successfully. You will be redirected to the login page.
                                    </Typography>
                                    <CircularProgress size={20} sx={{ mt: 2 }} />
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Right side - Image */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            bgcolor: '#f8f9fa',
                            position: 'relative'
                        }}
                    >
                        <Box
                            component="img"
                            src={forgetPasswordImage}
                            alt="Reset Password"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                p: 4
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ForgetPassword;