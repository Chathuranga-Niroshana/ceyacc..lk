/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import AuthHeader from '../../components/layout/AuthHeader';
import registerTeacherImg from '../../assets/images/authPages/teacherRegister.png';
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
    Chip,
    OutlinedInput,
    Grid
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import MainButton from '../../components/button/MainButton';
import SelectField from '../../components/input/SelectField';
import { artsStreamSubjects, commerceStreamSubjects, olSubjects, scienceStreamSubjects, technologyStreamSubjects } from '../../data/schoolSubjects';


const subjects = [
    ...olSubjects,
    ...scienceStreamSubjects,
    ...commerceStreamSubjects,
    ...artsStreamSubjects,
    ...technologyStreamSubjects
]

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

const TeacherRegister = ({
    nextPage,
    prevPage,
    teacherData,
    setTeacherData,
    errors,
    setErrors,
    provinces,
    districts
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherData(prev => ({
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
        setTeacherData(prev => ({
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
        setTeacherData(prev => ({
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

    const handleSubjectsChange = (event) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        const selectedSubjects = typeof value === 'string' ? value.split(',') : value;

        setTeacherData(prev => ({
            ...prev,
            subjectsTaught: selectedSubjects
        }));

        // Clear error when field is edited
        if (errors.subjectsTaught) {
            setErrors(prev => ({
                ...prev,
                subjectsTaught: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const nicRegex = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/;

        if (!teacherData.dob) newErrors.dob = 'Date of birth is required';
        if (!teacherData.nic) newErrors.nic = 'NIC is required';
        else if (!nicRegex.test(teacherData.nic)) newErrors.nic = 'Invalid NIC format';

        if (!teacherData.subjectsTaught || teacherData.subjectsTaught.length === 0)
            newErrors.subjectsTaught = 'Please select at least one subject';
        if (!teacherData.teachingExperience) newErrors.teachingExperience = 'Teaching experience is required';
        if (!teacherData.schoolName) newErrors.schoolName = 'School name is required';
        if (!teacherData.schoolAddressLineOne) newErrors.schoolAddressLineOne = 'School address is required';
        if (!teacherData.city) newErrors.city = 'City is required';
        if (!teacherData.district) newErrors.district = 'District is required';
        if (!teacherData.province) newErrors.province = 'Province is required';

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
    const availableDistricts = teacherData.province ? districts[teacherData.province] || [] : [];

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
                            <AuthHeader header="Teacher Information" />

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={itemVariants}>
                                    <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
                                        Please provide your professional details to help students find you.
                                    </Typography>
                                </motion.div>

                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                                <InputField
                                                    id="dob"
                                                    label="Date of Birth"
                                                    type="date"
                                                    name="dob"
                                                    value={teacherData.dob || ''}
                                                    onChange={handleChange}
                                                    error={!!errors.dob}
                                                    helperText={errors.dob}
                                                    fullWidth
                                                    required
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                                <InputField
                                                    id="nic"
                                                    label="NIC Number"
                                                    placeholder="Enter your NIC"
                                                    name="nic"
                                                    value={teacherData.nic || ''}
                                                    onChange={handleChange}
                                                    error={!!errors.nic}
                                                    helperText={errors.nic}
                                                    fullWidth
                                                    required
                                                />
                                            </motion.div>
                                        </Grid>
                                    </Grid>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <FormControl fullWidth error={!!errors.subjectsTaught}>
                                            <InputLabel id="subjects-taught-label">Subjects Taught</InputLabel>
                                            <Select
                                                labelId="subjects-taught-label"
                                                id="subjects-taught"
                                                multiple
                                                value={teacherData.subjectsTaught || []}
                                                onChange={handleSubjectsChange}
                                                input={<OutlinedInput label="Subjects Taught" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {subjects.map((subject) => (
                                                    <MenuItem key={subject} value={subject}>
                                                        {subject}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.subjectsTaught && <FormHelperText>{errors.subjectsTaught}</FormHelperText>}
                                        </FormControl>
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <FormControl fullWidth error={!!errors.teachingExperience}>
                                            <InputLabel id="teaching-experience-label">Teaching Experience</InputLabel>
                                            <Select
                                                labelId="teaching-experience-label"
                                                id="teachingExperience"
                                                name="teachingExperience"
                                                value={teacherData.teachingExperience || ''}
                                                label="Teaching Experience"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Less than 1 year">Less than 1 year</MenuItem>
                                                <MenuItem value="1-3 years">1-3 years</MenuItem>
                                                <MenuItem value="3-5 years">3-5 years</MenuItem>
                                                <MenuItem value="5-10 years">5-10 years</MenuItem>
                                                <MenuItem value="More than 10 years">More than 10 years</MenuItem>
                                            </Select>
                                            {errors.teachingExperience && <FormHelperText>{errors.teachingExperience}</FormHelperText>}
                                        </FormControl>
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <InputField
                                            id="schoolName"
                                            label="School Name"
                                            placeholder="Enter your school name"
                                            name="schoolName"
                                            value={teacherData.schoolName || ''}
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
                                            placeholder="Enter school address"
                                            name="schoolAddressLineOne"
                                            value={teacherData.schoolAddressLineOne || ''}
                                            onChange={handleChange}
                                            error={!!errors.schoolAddressLineOne}
                                            helperText={errors.schoolAddressLineOne}
                                            fullWidth
                                            required
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ marginBottom: 10 }}>
                                        <InputField
                                            id="city"
                                            label="City"
                                            placeholder="Enter city"
                                            name="city"
                                            value={teacherData.city || ''}
                                            onChange={handleChange}
                                            error={!!errors.city}
                                            helperText={errors.city}
                                            fullWidth
                                            required
                                        />
                                    </motion.div>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <motion.div variants={itemVariants} sx={{ mb: 3 }}>
                                                <SelectField
                                                    label="Province"
                                                    list={provinces}
                                                    value={teacherData.province || null}
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
                                                    value={teacherData.district || null}
                                                    onChange={handleDistrictChange}
                                                    disabled={!teacherData.province}
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
                                                size="large"
                                                type="submit"
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
                            src={registerTeacherImg}
                            alt="Teacher Registration"
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

export default TeacherRegister;