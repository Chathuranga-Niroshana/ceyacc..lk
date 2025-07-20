/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';
import MediaInputField from '../../components/input/MediaInputField';

// Icons
import {
    Image,
    Public,
    Lock,
    LockOpen,
    Send
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { createPost } from '../../features/posts/postSlice';
import cloudinaryUpload from '../../utils/cloudinaryInstance';

const CreatePost = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
        media: [],
        isPrivate: false
    });
    const [errors, setErrors] = useState({});
    const [uploadProgress, setUploadProgress] = useState([]); // Progress for each file
    const [uploading, setUploading] = useState(false); // True if any file is uploading
    const dispatch = useDispatch()

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

    const togglePrivacy = () => {
        setIsPrivate(!isPrivate);
        setData(prev => ({
            ...prev,
            isPrivate: !isPrivate
        }));
    };

    // Helper to get media type from URL
    const getMediaType = (url) => {
        if (!url) return null;
        const ext = url.split('.').pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
        if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
        if (["pdf"].includes(ext)) return "pdf";
        return "other";
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || uploading) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Only send the first media file as media_link and its type
            const media_link = data.media[0] || null;
            const media_type = getMediaType(media_link);
            const payload = {
                media_link,
                media_type,
                title: data.title,
                description: data.description,
                is_public: !isPrivate
            };
            const res = await dispatch(createPost(payload)).unwrap();
            console.log("Post created:", res);
            // Log the data that would be sent to backend
            console.log("Post data:", payload);

            // Reset form after successful submission
            setData({
                title: "",
                description: "",
                media: [],
                isPrivate: false
            });

            setIsPrivate(false);

            // Show success notification - in a real app, use a toast library
            alert("Post created successfully!");

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                    {/* Title Input */}
                    <div>
                        <InputField
                            label="Title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            placeholder="Enter a title for your post"
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
                            placeholder="What's on your mind?"
                            multiline
                            rows={4}
                            error={errors.description}
                            required
                        />
                    </div>

                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Media (Optional)
                        </label>
                        <MediaInputField
                            onChange={handleMediaChange}
                            maxFiles={1}
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
                        {data.media.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Media Links:</p>
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

                    {/* Privacy Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={togglePrivacy}
                                className={`flex items-center gap-2 py-2 px-4 rounded-full ${isPrivate
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}
                            >
                                {isPrivate ? (
                                    <>
                                        <Lock fontSize="small" />
                                        <span>Private</span>
                                    </>
                                ) : (
                                    <>
                                        <Public fontSize="small" />
                                        <span>Public</span>
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-500">
                                {isPrivate
                                    ? "Only you will see this post"
                                    : "Everyone can see this post"}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <MainButton
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className="min-w-24"
                            icon={<Send />}
                            label={isSubmitting ? "Posting..." : uploading ? "Uploading..." : "Post"}
                        />
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default CreatePost;