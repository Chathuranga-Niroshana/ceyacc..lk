/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import AuthHeader from '../../components/layout/AuthHeader';
import registerStuImg from '../../assets/images/authPages/studentRegister.png';
import {
    Box,
    Container,
    Typography,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Grid
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import MainButton from '../../components/button/MainButton';
import SelectField from '../../components/input/SelectField';
import { grades } from '../../data/grades';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

const StudentDataRegister = ({
    nextPage,
    prevPage,
    studentData,
    setStudentData,
    errors,
    setErrors,
    provinces,
    districts
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({
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

    // Handle changes from SelectField (Autocomplete)
    const handleProvinceChange = (event, newValue) => {
        setStudentData(prev => ({
            ...prev,
            province: newValue,
            district: '' // Reset district when province changes
        }));

        // Clear province error if it exists
        if (errors.province) {
            setErrors(prev => ({
                ...prev,
                province: ''
            }));
        }
    };

    const handleDistrictChange = (event, newValue) => {
        setStudentData(prev => ({
            ...prev,
            district: newValue
        }));

        // Clear district error if it exists
        if (errors.district) {
            setErrors(prev => ({
                ...prev,
                district: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!studentData.grade) newErrors.grade = 'Grade is required';
        if (!studentData.schoolName) newErrors.schoolName = 'School name is required';
        // if (!studentData.city) newErrors.city = 'City is required';
        // if (!studentData.district) newErrors.district = 'District is required';
        if (!studentData.province) newErrors.province = 'Province is required';

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

    // Get available districts based on selected province
    const availableDistricts = studentData.province ? districts[studentData.province] || [] : [];

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
                            <AuthHeader header="Student Information" />

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={itemVariants}>
                                    <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
                                        Please provide details about your education to help us customize your learning experience.
                                    </Typography>
                                </motion.div>

                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <InputField
                                            id="dob"
                                            label="Date of Birth"
                                            type="date"
                                            name="dob"
                                            value={studentData.dob || ''}
                                            onChange={handleChange}
                                            error={!!errors.dob}
                                            helperText={errors.dob}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <FormControl fullWidth error={!!errors.grade}>
                                            <InputLabel id="grade-label">Current Grade</InputLabel>
                                            <Select
                                                labelId="grade-label"
                                                id="grade"
                                                name="grade"
                                                value={studentData.grade || ''}
                                                label="Current Grade"
                                                onChange={handleChange}
                                            >
                                                {grades.map((grade, index) => (
                                                    <MenuItem key={index + 1} value={grade.value}>
                                                        {grade.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.grade && <FormHelperText>{errors.grade}</FormHelperText>}
                                        </FormControl>
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <InputField
                                            id="schoolName"
                                            label="School Name"
                                            placeholder="Enter your school name"
                                            name="schoolName"
                                            value={studentData.schoolName || ''}
                                            onChange={handleChange}
                                            error={!!errors.schoolName}
                                            helperText={errors.schoolName}
                                            fullWidth
                                            required
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <InputField
                                            id="schoolAddressLineOne"
                                            label="School Address"
                                            placeholder="Enter school address line 01"
                                            name="schoolAddressLineOne"
                                            value={studentData.schoolAddressLineOne || ''}
                                            onChange={handleChange}
                                            error={!!errors.schoolAddressLineOne}
                                            helperText={errors.schoolAddressLineOne}
                                            fullWidth
                                            required
                                        />
                                    </motion.div>

                                    {/* <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <InputField
                                            id="city"
                                            label="City"
                                            placeholder="Enter city"
                                            name="city"
                                            value={studentData.city || ''}
                                            onChange={handleChange}
                                            error={!!errors.city}
                                            helperText={errors.city}
                                            fullWidth
                                            required
                                        />
                                    </motion.div> */}

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <motion.div variants={itemVariants} sx={{ mb: 3 }}>
                                                <SelectField
                                                    label="Province"
                                                    list={provinces}
                                                    value={studentData.province || null}
                                                    onChange={handleProvinceChange}
                                                />
                                                {errors.province && (
                                                    <FormHelperText error>{errors.province}</FormHelperText>
                                                )}
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <motion.div variants={itemVariants} sx={{ mb: 3 }}>
                                                <SelectField
                                                    label="District"
                                                    list={availableDistricts}
                                                    value={studentData.district || null}
                                                    onChange={handleDistrictChange}
                                                    disabled={!studentData.province}
                                                />
                                                {errors.district && (
                                                    <FormHelperText error>{errors.district}</FormHelperText>
                                                )}
                                            </motion.div>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <MainButton
                                                type="button"
                                                onClick={prevPage}
                                                variant="outlined"
                                                color="primary"
                                                sx={{
                                                    bgcolor: '#BA0A0C',
                                                    '&:hover': { bgcolor: '#9e090b' },
                                                    py: 1.5,
                                                    px: 3,
                                                    borderRadius: 2,
                                                }}
                                                startIcon={<ArrowBack />}
                                                label="Back"
                                            />
                                        </motion.div>

                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <MainButton
                                                onClick={handleSubmit}
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    bgcolor: '#BA0A0C',
                                                    '&:hover': { bgcolor: '#9e090b' },
                                                    py: 1.5,
                                                    px: 3,
                                                    borderRadius: 2
                                                }}
                                                endIcon={<ArrowForward />}
                                                label="Register"
                                            />
                                        </motion.div>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Box>
                    </Grid>

                    {/* Right side - Image (visible on medium and larger screens) */}
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
                            src={registerStuImg}
                            alt="Student Registration"
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

export default StudentDataRegister;