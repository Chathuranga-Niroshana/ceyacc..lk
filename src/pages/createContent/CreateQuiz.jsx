/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';
import MediaInputField from '../../components/input/MediaInputField';
import { createQuiz, clearError } from '../../features/quizzes/quizzesSlice';
import cloudinaryUpload from '../../utils/cloudinaryInstance';

// Icons
import {
    Image,
    Send,
    Check
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const CreateQuiz = () => {
    const [data, setData] = useState({
        title: "",
        question: "",
        description: "",
        answers: ["", "", "", "", ""],
        correctAnswer: 0, // Index of the correct answer (defaulting to first answer)
        media: []
    });
    const [errors, setErrors] = useState({});
    const [uploadProgress, setUploadProgress] = useState([]); // Progress for each file
    const [uploading, setUploading] = useState(false); // True if any file is uploading
    const dispatch = useDispatch();

    // Get state from Redux
    const { loading, error } = useSelector((state) => state.quizzes);

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

    // Handle answer changes
    const handleAnswerChange = (index, value) => {
        const newAnswers = [...data.answers];
        newAnswers[index] = value;

        setData(prev => ({
            ...prev,
            answers: newAnswers
        }));

        // Clear error when user types
        if (errors[`answer_${index}`]) {
            setErrors(prev => ({
                ...prev,
                [`answer_${index}`]: ""
            }));
        }
    };

    // Set correct answer
    const setCorrectAnswer = (index) => {
        setData(prev => ({
            ...prev,
            correctAnswer: index
        }));
    };

    // Handle media files
    const handleMediaChange = async (files) => {
        setUploading(true);
        const progressArr = Array.from(files).map(() => 0);
        setUploadProgress(progressArr);
        const uploadPromises = Array.from(files).map((file, idx) =>
            cloudinaryUpload(file, (progress) => {
                setUploadProgress(prev => {
                    const updated = [...prev];
                    updated[idx] = progress;
                    return updated;
                });
            })
        );
        const mediaUrls = (await Promise.all(uploadPromises)).filter(Boolean);
        setData(prev => ({
            ...prev,
            media: mediaUrls
        }));
        setUploading(false);
    };

    // Clear error when component mounts or when error changes
    useEffect(() => {
        if (error) {
            // You can show error toast here
            console.error("Quiz creation error:", error);
        }
    }, [error]);

    // Clear error when user starts typing
    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [data, dispatch]);

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!data.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!data.question.trim()) {
            newErrors.question = "Question is required";
        }

        if (!data.description.trim()) {
            newErrors.description = "Description is required";
        } else if (data.description.trim().length < 10) {
            newErrors.description = "Description should be at least 10 characters";
        }

        // Validate at least two answers are provided
        let validAnswersCount = 0;
        data.answers.forEach((answer, index) => {
            if (answer.trim()) {
                validAnswersCount++;
            } else if (index < 2) { // Only require first two answers
                newErrors[`answer_${index}`] = "At least two answers are required";
            }
        });

        if (validAnswersCount < 2) {
            newErrors.answers = "At least two valid answers are required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || uploading) {
            return;
        }

        // Prepare data for submission - filter out empty answers
        const filteredAnswers = data.answers.filter(answer => answer.trim() !== "");

        // Calculate the correct answer index based on filtered answers
        let correctAnswerIndex = 0;
        let currentIndex = 0;
        for (let i = 0; i < data.answers.length; i++) {
            if (data.answers[i].trim() !== "") {
                if (i === data.correctAnswer) {
                    correctAnswerIndex = currentIndex + 1; // API expects 1-based index
                    break;
                }
                currentIndex++;
            }
        }

        // Prepare submission data according to API schema
        const submissionData = {
            title: data.title,
            question: data.question,
            description: data.description,
            answer_one: filteredAnswers[0] || "",
            answer_two: filteredAnswers[1] || "",
            answer_three: filteredAnswers[2] || null,
            answer_four: filteredAnswers[3] || null,
            answer_five: filteredAnswers[4] || null,
            correct_answer: correctAnswerIndex,
            media_url_one: data.media[0] || null,
            media_url_two: data.media[1] || null,
            media_url_three: data.media[2] || null,
            visibility: true
        };

        try {
            // Dispatch the createQuiz action
            const result = await dispatch(createQuiz(submissionData)).unwrap();

            // Reset form after successful submission
            setData({
                title: "",
                question: "",
                description: "",
                answers: ["", "", "", "", ""],
                correctAnswer: 0,
                media: []
            });

            // Show success notification - in a real app, use a toast library
            alert("Quiz created successfully!");

        } catch (error) {
            console.error("Error creating quiz:", error);
            // Error is already handled by Redux state
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6"
        >
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    {/* Quiz Title */}
                    <div>
                        <InputField
                            label="Quiz Title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            placeholder="Enter a title for this quiz"
                            error={errors.title}
                            required
                        />
                    </div>

                    {/* Question Input */}
                    <div>
                        <InputField
                            label="Question"
                            name="question"
                            value={data.question}
                            onChange={handleChange}
                            placeholder="Enter your question"
                            error={errors.question}
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
                            placeholder="Provide additional context or explanation for this question"
                            multiline
                            rows={3}
                            error={errors.description}
                            required
                        />
                    </div>

                    {/* Media Upload (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Media (Optional)
                        </label>
                        <MediaInputField
                            onChange={handleMediaChange}
                            maxFiles={3}
                            value={data.media}
                        />
                        {/* Upload Progress */}
                        {uploading && uploadProgress.length > 0 && (
                            <div className="mt-2">
                                {uploadProgress.map((progress, idx) => (
                                    <progress key={idx} value={progress} max="100" className="w-full mb-1">{progress}%</progress>
                                ))}
                                <span className="text-xs text-blue-500">Uploading files...</span>
                            </div>
                        )}
                        {/* Preview of media URLs */}
                        {data.media && data.media.length > 0 && (
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

                    {/* Answers Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Answers
                            </label>
                            <span className="text-xs text-gray-500">Select the correct answer</span>
                        </div>

                        {errors.answers && (
                            <p className="text-sm text-red-500 mb-2">{errors.answers}</p>
                        )}

                        <div className="space-y-3">
                            {data.answers.map((answer, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCorrectAnswer(index)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 ${data.correctAnswer === index
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 bg-white'
                                            }`}
                                    >
                                        {data.correctAnswer === index && <Check fontSize="small" />}
                                    </button>
                                    <div className="flex-grow">
                                        <InputField
                                            value={answer}
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            placeholder={`Answer ${index + 1}${index < 2 ? ' (required)' : ' (optional)'}`}
                                            error={errors[`answer_${index}`]}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Provide at least two answer options. Empty answers will be ignored.</p>
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
                        disabled={loading || uploading}
                        className="mt-4"
                        icon={<Send />}
                        label={loading ? "Creating Quiz..." : uploading ? "Uploading..." : "Create Quiz"}
                    />
                </div>
            </form>
        </motion.div>
    );
};

export default CreateQuiz;