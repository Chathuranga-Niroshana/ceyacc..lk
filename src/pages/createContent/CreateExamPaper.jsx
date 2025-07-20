/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    artsStreamSubjects,
    commerceStreamSubjects,
    olSubjects,
    scienceStreamSubjects,
    technologyStreamSubjects
} from '../../data/schoolSubjects';
import MediaUpload from '../../components/input/MediaInputField';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';
import SelectField from '../../components/input/SelectField';
import RadioButton from '../../components/input/RadioButton';
import { UploadFile, Image, School, MenuBook, NoteAdd } from '@mui/icons-material';
import { examTypes, subjectStreams } from '../../data/examTypes';
import { useDispatch, useSelector } from 'react-redux';
import { createExamPaper, clearError } from '../../features/examPapers/examPapersSlice';

const CreateExamPaper = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.examPapers);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [data, setData] = useState({
        subject: null,
        grade: null,
        school: "",
        semester: null,
        year: "",
        description: "",
        media: [],
    });
    const [errors, setErrors] = useState({});
    const [examType, setExamType] = useState('ol');
    const [subjectStream, setSubjectStream] = useState('science');
    const [subjects, setSubjects] = useState([]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // Update subjects based on exam type and stream
    useEffect(() => {
        if (examType === 'ol') {
            setSubjects(olSubjects.map(subject => ({ label: subject, value: subject })));
        } else {
            // AL subjects
            let streamSubjects;
            switch (subjectStream) {
                case 'science':
                    streamSubjects = scienceStreamSubjects;
                    break;
                case 'arts':
                    streamSubjects = artsStreamSubjects;
                    break;
                case 'commerce':
                    streamSubjects = commerceStreamSubjects;
                    break;
                case 'technology':
                    streamSubjects = technologyStreamSubjects;
                    break;
                default:
                    streamSubjects = [];
            }
            setSubjects(streamSubjects.map(subject => ({ label: subject, value: subject })));
        }
        // Reset subject selection when subjects change
        setData(prev => ({ ...prev, subject: null }));
    }, [examType, subjectStream]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSelectChange = (name) => (event, newValue) => {
        setData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear error when user selects
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleExamTypeChange = (e) => {
        setExamType(e.target.value);
    };

    const handleStreamChange = (e) => {
        setSubjectStream(e.target.value);
    };

    // Handle media files
    const handleMediaChange = (files) => {
        // In a real application, these would be uploaded to your backend
        // and you would receive URLs in response

        const simulateUpload = (file) => {
            // Create a mock URL
            // In a real app, this would be the URL returned from your server
            return `https://your-backend.com/uploads/${file.name.replace(/\s+/g, '-')}`;
        };

        const mediaUrls = files.map(simulateUpload);

        setData(prev => ({
            ...prev,
            media: [...prev.media, ...mediaUrls]
        }));
    };

    // Clear error when component mounts or when user starts typing
    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [dispatch, error]);

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!data.year.trim()) {
            newErrors.year = "Year is required";
        }

        if (!data.subject) {
            newErrors.subject = "Subject is required";
        }

        if (!data.grade) {
            newErrors.grade = "Grade is required";
        }

        if (!data.school.trim()) {
            newErrors.school = "School name is required";
        }

        if (!data.semester) {
            newErrors.semester = "Semester is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for submission
            const submissionData = {
                subject: data.subject?.value || "",
                grade: parseInt(data.grade?.value) || 0,
                school: data.school.trim(),
                semester: data.semester?.value || "",
                year: data.year,
                examType: examType,
                description: data.description.trim() || null,
                media: data.media.length > 0 ? data.media : null,
            };

            console.log("Submitting exam paper data:", submissionData);

            // Dispatch the create exam paper action
            const result = await dispatch(createExamPaper(submissionData));

            if (createExamPaper.fulfilled.match(result)) {
                // Reset form after successful submission
                setData({
                    subject: null,
                    grade: null,
                    school: "",
                    semester: null,
                    year: "",
                    description: "",
                    media: [],
                });
                setExamType('ol');
                setSubjectStream('science');
                setErrors({});

                // Show success message
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
            } else {
                // Error is handled by Redux state
                console.error("Failed to create exam paper");
            }

        } catch (error) {
            console.error("Error creating paper:", error);
            alert("Failed to create paper. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Grade options
    const gradeOptions = examType === 'ol'
        ? ['6', '7', '8', '9', '10', '11'].map(grade => ({ label: `Grade ${grade}`, value: grade }))
        : ['12', '13'].map(grade => ({ label: `Grade ${grade}`, value: grade }));

    // Semester options
    const semesterOptions = ['First Term', 'Second Term', 'Third Term', 'Final Exam']
        .map(sem => ({ label: sem, value: sem }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg px-8 pb-8"
        >
            {/* Error Display */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                    <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
            )}

            {/* Success Display */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                    <p className="text-green-600 text-sm">Exam paper created successfully! 🎉</p>
                </motion.div>
            )}
            <form onSubmit={handleSubmit}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-6"
                >
                    {/* Exam Type Selection */}
                    <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-700 mb-3">Exam Type</h2>
                        <RadioButton
                            list={examTypes}
                            value={examType}
                            onChange={handleExamTypeChange}
                        />
                    </motion.div>

                    {/* Stream Selection for A/L */}
                    <AnimatePresence>
                        {examType === 'al' && (
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-50 p-4 rounded-lg"
                            >
                                <h2 className="text-lg font-medium text-gray-700 mb-3">Subject Stream</h2>
                                <RadioButton
                                    list={subjectStreams}
                                    value={subjectStream}
                                    onChange={handleStreamChange}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Basic Information */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <SelectField
                                list={subjects}
                                label="Subject"
                                value={data.subject}
                                onChange={handleSelectChange('subject')}
                                disabled={subjects.length === 0}
                            />
                            {errors.subject && (
                                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                            )}
                        </div>

                        <div>
                            <SelectField
                                list={gradeOptions}
                                label="Grade"
                                value={data.grade}
                                onChange={handleSelectChange('grade')}
                            />
                            {errors.grade && (
                                <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputField
                                id="school"
                                label="School"
                                name="school"
                                value={data.school}
                                onChange={handleChange}
                                placeholder="Enter school name"
                                error={errors.school}
                                required
                                icon={<School fontSize="small" />}
                            />
                        </div>

                        <div>
                            <SelectField
                                list={semesterOptions}
                                label="Semester"
                                value={data.semester}
                                onChange={handleSelectChange('semester')}
                            />
                            {errors.semester && (
                                <p className="text-red-500 text-xs mt-1">{errors.semester}</p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <InputField
                            id="year"
                            label="Exam Date"
                            type="date"
                            name="year"
                            value={data.year || ''}
                            onChange={handleChange}
                            error={errors.year}
                            helperText={errors.year}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </motion.div>

                    {/* Description Input */}
                    <motion.div variants={itemVariants}>
                        <InputField
                            label="Description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Provide additional context or explanation for this question"
                            multiline
                            rows={3}
                            error={errors.description}
                            icon={<NoteAdd fontSize="small" />}
                        />
                    </motion.div>

                    {/* Media Upload (Optional) */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Media (PDF Important)
                        </label>
                        <MediaUpload
                            onChange={handleMediaChange}
                            maxFiles={3}
                            value={data.media}
                        />

                        {/* Preview of media URLs */}
                        <AnimatePresence>
                            {data.media && data.media.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3"
                                >
                                    <p className="text-sm font-medium text-gray-700 mb-1">Media Files:</p>
                                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                                        {data.media.map((url, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="mb-1 flex items-center"
                                            >
                                                <Image fontSize="small" className="mr-1 text-blue-500" />
                                                <span className="truncate">{url}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MainButton
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="mt-4 w-full"
                            icon={<UploadFile />}
                            label={isSubmitting || loading ? "Creating Exam Paper..." : "Create Exam Paper"}
                        />
                    </motion.div>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default CreateExamPaper;