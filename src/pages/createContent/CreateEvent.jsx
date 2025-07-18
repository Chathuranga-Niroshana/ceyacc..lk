/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';
import MediaInputField from '../../components/input/MediaInputField';

// Icons
import {
    Image,
    Send
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../features/events/eventSlice';

const CreateEvent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
        media: [],
        date: "",
        time: "",
        location: "",
        audience: "",
    });
    const [errors, setErrors] = useState({});
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
    const handleMediaChange = (files) => {
        // In a real application, these would be uploaded to your backend
        // and you would receive URLs in response
        // This is a simulation of that process

        const simulateUpload = (file) => {
            // Create a mock URL
            // In a real app, this would be the URL returned from your server
            return `https://your-backend.com/uploads/${file.name.replace(/\s+/g, '-')}`;
        };

        const mediaUrls = files.map(simulateUpload);

        setData(prev => ({
            ...prev,
            media: mediaUrls
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const date_time = new Date(`${data.date}T${data.time}`).toISOString();
            const [media_url_one, media_url_two, media_url_three, media_url_four, media_url_five] = data.media;

            const payload = {
                ...data,
                date_time,
                media_url_one,
                media_url_two,
                media_url_three,
                media_url_four,
                media_url_five,
            };

            const res = await dispatch(createEvent(payload)).unwrap();
            console.log("Post data:", payload);

            setData({
                title: "",
                description: "",
                media: [],
                date: "",
                time: "",
                location: "",
                audience: ""
            });

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
                            placeholder="Enter a title for your event"
                            error={errors.title}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputField
                                name="date"
                                value={data.date}
                                onChange={handleChange}
                                placeholder="Enter a date for your event"
                                error={errors.date}
                                required
                                type='date'
                            />
                        </div>
                        <div>
                            <InputField
                                name="time"
                                value={data.time}
                                onChange={handleChange}
                                placeholder="Enter a time for your event"
                                error={errors.time}
                                required
                                type='time'
                            />
                        </div>
                    </div>
                    <div>
                        <InputField
                            label="Location"
                            name="location"
                            value={data.location}
                            onChange={handleChange}
                            placeholder="Enter a location for your event"
                            error={errors.location}
                            required
                        />
                    </div>
                    <div>
                        <InputField
                            label="Intended Audience"
                            name="audience"
                            value={data.audience}
                            onChange={handleChange}
                            placeholder="What is the audience for your event?"
                            error={errors.audience}
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
                            maxFiles={5}
                            value={data.media}
                        />

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


                    {/* Submit Button */}
                    <MainButton
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-24"
                        icon={<Send />}
                        label={isSubmitting ? "Posting..." : "Post"}
                    />
                </div>
            </form>
        </motion.div>
    )
}

export default CreateEvent