/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';
import MediaInputField from '../../components/input/MediaInputField';
import { createCourse, clearError } from '../../features/courses/coursesSlice';

// Icons
import {
    Image,
    Public,
    Lock,
    LockOpen,
    Send,
    Add,
    Delete,
    Check,
    QuestionMark
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const CreateCourse = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [data, setData] = useState({
        thumbnail: [],
        title: "",
        description: "",
        media: [],
        resources: [],
        questions: [],
        marksForPass: 75,
        applicableGrade: "",
        applicableLevel: 10,
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    // Get state from Redux
    const { loading, error } = useSelector((state) => state.courses);

    // Question template for new questions
    const emptyQuestion = {
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: 0, // Index of correct answer
        marks: 10, // Default marks
    };

    // Handle text input changes
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

    // Handle media files
    const handleMediaChange = (files, type = 'media') => {
        // In a real application, these would be uploaded to your backend
        // and you would receive URLs in response

        const simulateUpload = (file) => {
            // Create a mock URL
            return `https://your-backend.com/uploads/${file.name.replace(/\s+/g, '-')}`;
        };

        const mediaUrls = files.map(simulateUpload);

        setData(prev => ({
            ...prev,
            [type]: [...prev[type], ...mediaUrls]
        }));
    };

    // Clear error when component mounts or when error changes
    useEffect(() => {
        if (error) {
            // You can show error toast here
            console.error("Course creation error:", error);
        }
    }, [error]);

    // Clear error when user starts typing
    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [data, dispatch]);

    // Handle resource files specifically
    const handleResourceChange = (files) => {
        handleMediaChange(files, 'resources');
    };

    const togglePrivacy = () => {
        setIsPrivate(!isPrivate);
        setData(prev => ({
            ...prev,
            isPrivate: !isPrivate
        }));
    };

    // Add a new question
    const addQuestion = () => {
        setData(prev => ({
            ...prev,
            questions: [...prev.questions, { ...emptyQuestion }]
        }));
    };

    // Remove a question
    const removeQuestion = (index) => {
        setData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    // Update question field
    const handleQuestionChange = (index, field, value) => {
        setData(prev => {
            const updatedQuestions = [...prev.questions];

            if (field === 'answers') {
                const [answerIndex, answerValue] = value;
                updatedQuestions[index].answers[answerIndex] = answerValue;
            } else {
                updatedQuestions[index][field] = value;
            }

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!data.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!data.description.trim()) {
            newErrors.description = "Description is required";
        } else if (data.description.trim().length < 10) {
            newErrors.description = "Description should be at least 10 characters";
        }

        if (data.questions.length > 0) {
            // Validate questions if any exist
            data.questions.forEach((question, index) => {
                if (!question.question.trim()) {
                    newErrors[`question_${index}`] = "Question text is required";
                }

                question.answers.forEach((answer, ansIndex) => {
                    if (!answer.trim()) {
                        newErrors[`question_${index}_answer_${ansIndex}`] = "Answer text is required";
                    }
                });

                if (question.marks <= 0) {
                    newErrors[`question_${index}_marks`] = "Marks must be greater than 0";
                }
            });
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

        // Prepare submission data according to API schema
        const submissionData = {
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail.length > 0 ? data.thumbnail : null,
            media: data.media.length > 0 ? data.media : null,
            resources: data.resources.length > 0 ? data.resources : null,
            marksForPass: data.marksForPass,
            applicableGrade: data.applicableGrade,
            applicableLevel: data.applicableLevel,
            questions: data.questions.map(q => ({
                question: q.question,
                answers: q.answers,
                correctAnswer: q.correctAnswer,
                marks: q.marks
            }))
        };

        try {
            // Dispatch the createCourse action
            await dispatch(createCourse(submissionData)).unwrap();

            // Reset form after successful submission
            setData({
                thumbnail: [],
                title: "",
                description: "",
                media: [],
                resources: [],
                questions: [],
                marksForPass: 75,
                applicableGrade: "",
                applicableLevel: 10,
            });

            setIsPrivate(false);

            // Show success notification - in a real app, use a toast library
            alert("Course created successfully!");

        } catch (error) {
            console.error("Error creating course:", error);
            // Error is already handled by Redux state
        }
    };

    // Calculate total possible marks
    const totalMarks = data.questions.reduce((sum, q) => sum + parseInt(q.marks || 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6"
        >
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Course</h1>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail Image
                        </label>
                        <MediaInputField
                            onChange={(files) => handleMediaChange(files, 'thumbnail')}
                            maxFiles={1}
                            value={data.thumbnail}
                        />

                        {/* Preview of media URLs */}
                        {data.thumbnail.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Thumbnail Image:</p>
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                                    {data.thumbnail.map((url, index) => (
                                        <div key={index} className="mb-1 flex items-center">
                                            <Image fontSize="small" className="mr-1 text-blue-500" />
                                            <span className="truncate">{url}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Title Input */}
                    <div>
                        <InputField
                            label="Title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            placeholder="Enter a title for your course"
                            error={errors.title}
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <InputField
                            label="Description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="What's this course about and why?"
                            multiline
                            rows={4}
                            error={errors.description}
                            required
                        />
                    </div>

                    {/* Privacy Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={togglePrivacy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isPrivate
                                ? 'bg-gray-200 text-gray-700'
                                : 'bg-blue-100 text-blue-700'
                                }`}
                        >
                            {isPrivate ? <Lock fontSize="small" /> : <Public fontSize="small" />}
                            {isPrivate ? 'Private' : 'Public'}
                        </button>
                        <span className="text-xs text-gray-500">
                            {isPrivate
                                ? 'Only invited users can view this course'
                                : 'Anyone can view this course'}
                        </span>
                    </div>

                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Media
                        </label>
                        <MediaInputField
                            onChange={(files) => handleMediaChange(files)}
                            maxFiles={10}
                            value={data.media}
                        />

                        {/* Preview of media URLs */}
                        {data.media.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Media Files:</p>
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                                    {data.media.map((url, index) => (
                                        <div key={index} className="mb-1 flex items-center">
                                            <Image fontSize="small" className="mr-1 text-blue-500" />
                                            <span className="truncate">{url}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resources Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resources
                        </label>
                        <MediaInputField
                            onChange={handleResourceChange}
                            maxFiles={15}
                            value={data.resources}
                        />

                        {/* Preview of resource URLs */}
                        {data.resources.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Resource Files:</p>
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                                    {data.resources.map((url, index) => (
                                        <div key={index} className="mb-1 flex items-center">
                                            <Image fontSize="small" className="mr-1 text-blue-500" />
                                            <span className="truncate">{url}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Level and Grade */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputField
                                label="Applicable Level"
                                name="applicableLevel"
                                type="number"
                                value={data.applicableLevel}
                                onChange={handleChange}
                                placeholder="Enter applicable level"
                                error={errors.applicableLevel}
                                required
                            />
                        </div>
                        <div>
                            <InputField
                                label="Applicable Grade"
                                name="applicableGrade"
                                value={data.applicableGrade}
                                onChange={handleChange}
                                placeholder="Enter applicable school grade"
                                error={errors.applicableGrade}
                                required
                            />
                        </div>
                    </div>

                    {/* Passing Marks */}
                    <div>
                        <InputField
                            label="Required Marks for Certificate (%)"
                            name="marksForPass"
                            type="number"
                            min="0"
                            max="100"
                            value={data.marksForPass}
                            onChange={handleChange}
                            placeholder="Enter marks needed to get the certificate"
                            error={errors.marksForPass}
                            required
                        />
                    </div>

                    {/* Questions Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                                <QuestionMark className="mr-2 text-blue-600" />
                                Questions
                                {data.questions.length > 0 && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        (Total: {data.questions.length}, Possible marks: {totalMarks})
                                    </span>
                                )}
                            </h2>
                            <MainButton
                                type="button"
                                onClick={addQuestion}
                                className="px-3 py-1"
                                variant="outlined"
                                icon={<Add />}
                                label="Add Question"
                            />
                        </div>

                        {data.questions.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <QuestionMark style={{ fontSize: 40 }} className="text-gray-400 mb-2" />
                                <p className="text-gray-500">No questions added yet</p>
                                <p className="text-sm text-gray-400 my-1 mb-3">Questions are optional but recommended for assessment</p>
                                <MainButton
                                    type="button"
                                    onClick={addQuestion}
                                    className="mt-4"
                                    variant="outlined"
                                    icon={<Add />}
                                    label="Add First Question"
                                />
                            </div>
                        )}

                        {data.questions.map((question, qIndex) => (
                            <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium text-gray-800">Question {qIndex + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Delete fontSize="small" />
                                    </button>
                                </div>

                                {/* Question Text */}
                                <div className="mb-4">
                                    <InputField
                                        label="Question"
                                        value={question.question}
                                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                        placeholder="Enter your question"
                                        error={errors[`question_${qIndex}`]}
                                        required
                                    />
                                </div>

                                {/* Answers */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Answers (select correct one)
                                    </label>
                                    <div className="space-y-2">
                                        {question.answers.map((answer, aIndex) => (
                                            <div key={aIndex} className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuestionChange(qIndex, 'correctAnswer', aIndex)}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${question.correctAnswer === aIndex
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 bg-white'
                                                        }`}
                                                >
                                                    {question.correctAnswer === aIndex && <Check fontSize="small" />}
                                                </button>
                                                <div className="flex-grow">
                                                    <InputField
                                                        value={answer}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'answers', [aIndex, e.target.value])}
                                                        placeholder={`Answer ${aIndex + 1}`}
                                                        error={errors[`question_${qIndex}_answer_${aIndex}`]}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Marks */}
                                <div className="w-24">
                                    <InputField
                                        label="Marks"
                                        type="number"
                                        min="1"
                                        value={question.marks}
                                        onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value) || 0)}
                                        error={errors[`question_${qIndex}_marks`]}
                                        required
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <MainButton
                        type="submit"
                        disabled={loading}
                        className="mt-6"
                        icon={<Send />}
                        label={loading ? "Creating Course..." : "Create Course"}
                    />
                </div>
            </form>
        </motion.div>
    );
};

export default CreateCourse;