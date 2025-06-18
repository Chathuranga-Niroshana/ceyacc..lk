/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../components/input/InputField';
import MainButton from '../../components/button/MainButton';

// Icons
import {
    Videocam,
    Videocam as VideocamIcon,
    VideocamOff,
    Settings,
    Share,
    People,
    Send,
    PhotoCamera,
    ScreenShare,
    Stop,
    Mic,
    MicOff,
    Edit
} from '@mui/icons-material';

const CreateLiveContent = () => {
    // States
    const [isLive, setIsLive] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [viewerCount, setViewerCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [availableDevices, setAvailableDevices] = useState({ video: [], audio: [] });
    const [selectedDevices, setSelectedDevices] = useState({ video: null, audio: null });
    const [showSettings, setShowSettings] = useState(false);

    // Form data
    const [data, setData] = useState({
        title: "",
        description: "",
        isPrivate: false,
        scheduledTime: null,
        tags: []
    });
    const [errors, setErrors] = useState({});

    // Refs
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    // Handle form input changes
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

    // Simulate fetching available devices
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();

                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const audioDevices = devices.filter(device => device.kind === 'audioinput');

                setAvailableDevices({
                    video: videoDevices,
                    audio: audioDevices
                });

                // Select first devices as default
                if (videoDevices.length > 0 && !selectedDevices.video) {
                    setSelectedDevices(prev => ({
                        ...prev,
                        video: videoDevices[0].deviceId
                    }));
                }

                if (audioDevices.length > 0 && !selectedDevices.audio) {
                    setSelectedDevices(prev => ({
                        ...prev,
                        audio: audioDevices[0].deviceId
                    }));
                }

            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        fetchDevices();
    }, []);

    // Handle camera toggle
    const toggleCamera = async () => {
        if (isCameraOn) {
            // Turn off camera
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
        } else {
            // Turn on camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: selectedDevices.video ? { deviceId: { exact: selectedDevices.video } } : true,
                    audio: isMicOn ? (selectedDevices.audio ? { deviceId: { exact: selectedDevices.audio } } : true) : false
                });

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraOn(true);
            } catch (error) {
                console.error("Error accessing camera:", error);
                alert("Could not access camera. Please check permissions and try again.");
            }
        }
    };

    // Handle mic toggle
    const toggleMic = async () => {
        if (!streamRef.current) {
            setIsMicOn(!isMicOn);
            return;
        }

        const audioTracks = streamRef.current.getAudioTracks();

        if (audioTracks.length > 0) {
            // Toggle existing audio tracks
            audioTracks.forEach(track => {
                track.enabled = !isMicOn;
            });
        } else if (!isMicOn) {
            // Add audio track if turning on mic
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: selectedDevices.audio ? { deviceId: { exact: selectedDevices.audio } } : true
                });

                audioStream.getAudioTracks().forEach(track => {
                    streamRef.current.addTrack(track);
                });
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        }

        setIsMicOn(!isMicOn);
    };

    // Handle device selection change
    const handleDeviceChange = async (type, deviceId) => {
        setSelectedDevices(prev => ({
            ...prev,
            [type]: deviceId
        }));

        // If camera is already on, restart with new device
        if (isCameraOn) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: type === 'video' ? { deviceId: { exact: deviceId } } :
                        (selectedDevices.video ? { deviceId: { exact: selectedDevices.video } } : true),
                    audio: isMicOn ? (
                        type === 'audio' ? { deviceId: { exact: deviceId } } :
                            (selectedDevices.audio ? { deviceId: { exact: selectedDevices.audio } } : true)
                    ) : false
                });

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error(`Error accessing ${type} device:`, error);
            }
        }
    };

    // Start live broadcast
    const startBroadcast = () => {
        if (!validateForm()) {
            return;
        }

        if (!isCameraOn) {
            alert("Please turn on your camera before starting the broadcast");
            return;
        }

        // Simulate broadcasting start
        setIsLive(true);
        setIsConfiguring(false);
        setViewerCount(0);
        setDuration(0);

        // Start duration timer
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);

            // Simulate viewers joining
            if (Math.random() > 0.7) {
                setViewerCount(prev => prev + Math.floor(Math.random() * 3) + 1);
            }
        }, 1000);

        // Log broadcast info
        console.log("Starting broadcast with:", {
            ...data,
            deviceInfo: {
                video: selectedDevices.video,
                audio: selectedDevices.audio,
                micEnabled: isMicOn
            }
        });
    };

    // End live broadcast
    const endBroadcast = () => {
        setIsLive(false);

        // Clear timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Show summary info
        const summary = {
            title: data.title,
            duration: duration,
            viewerCount: viewerCount,
            endTime: new Date().toISOString()
        };

        console.log("Broadcast ended:", summary);
        alert(`Broadcast ended after ${formatDuration(duration)} with ${viewerCount} viewers`);

        setIsConfiguring(true);
    };

    // Format seconds to mm:ss or hh:mm:ss
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full  mx-auto"
        >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <VideocamIcon className="mr-2" />
                        <h1 className="text-xl font-bold">Create Live Broadcast</h1>
                    </div>
                    {isLive && (
                        <div className="flex items-center">
                            <div className="animate-pulse flex items-center mr-4">
                                <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                                <span className="text-sm font-medium">LIVE</span>
                            </div>
                            <div className="flex items-center mr-4">
                                <People fontSize="small" className="mr-1" />
                                <span className="text-sm">{viewerCount}</span>
                            </div>
                            <div className="text-sm font-medium">
                                {formatDuration(duration)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className=" ">
                    <div className="flex flex-col gap-6">
                        {/* Video preview section */}
                        <div className="w-full">
                            <div className="bg-[#90091A] relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                                {/* Video element */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                ></video>

                                {/* Camera off overlay */}
                                {!isCameraOn && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#90091A] text-white">
                                        <VideocamOff style={{ fontSize: 48 }} className="mb-4 opacity-60" />
                                        <p className="text-lg font-medium">Camera is off</p>
                                        <button
                                            onClick={toggleCamera}
                                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                                        >
                                            <Videocam className="mr-2" />
                                            Turn on camera
                                        </button>
                                    </div>
                                )}

                                {/* Live indicator overlay */}
                                {isLive && (
                                    <div className="absolute top-4 left-4 flex items-center bg-red-600 text-white px-3 py-1 rounded-md">
                                        <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></span>
                                        <span className="text-sm font-bold">LIVE</span>
                                    </div>
                                )}

                                {/* Controls overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-center">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={toggleCamera}
                                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                                        >
                                            {isCameraOn ? <Videocam /> : <VideocamOff />}
                                        </button>

                                        <button
                                            onClick={toggleMic}
                                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                                        >
                                            {isMicOn ? <Mic /> : <MicOff />}
                                        </button>

                                        <button
                                            onClick={() => setShowSettings(!showSettings)}
                                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                                        >
                                            <Settings />
                                        </button>

                                        {!isLive ? (
                                            <button
                                                onClick={startBroadcast}
                                                disabled={isConfiguring && (!data.title || !isCameraOn)}
                                                className={`px-5 rounded-full flex items-center justify-center text-white ${isConfiguring && (!data.title || !isCameraOn)
                                                    ? 'bg-gray-500'
                                                    : 'bg-red-600 hover:bg-red-700'
                                                    }`}
                                            >
                                                <span className="mr-2">Go Live</span>
                                                {isConfiguring && (!data.title || !isCameraOn) ? <VideocamOff fontSize="small" /> : <Send fontSize="small" />}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={endBroadcast}
                                                className="px-5 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white"
                                            >
                                                <span className="mr-2">End</span>
                                                <Stop fontSize="small" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Device settings panel */}
                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 bg-gray-100 p-4 rounded-lg"
                                >
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Device Settings</h3>

                                    <div className="space-y-3">
                                        {/* Camera select */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Camera</label>
                                            <select
                                                value={selectedDevices.video || ''}
                                                onChange={(e) => handleDeviceChange('video', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
                                            >
                                                {availableDevices.video.map(device => (
                                                    <option key={device.deviceId} value={device.deviceId}>
                                                        {device.label || `Camera ${availableDevices.video.indexOf(device) + 1}`}
                                                    </option>
                                                ))}
                                                {availableDevices.video.length === 0 && (
                                                    <option value="">No cameras found</option>
                                                )}
                                            </select>
                                        </div>

                                        {/* Microphone select */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Microphone</label>
                                            <select
                                                value={selectedDevices.audio || ''}
                                                onChange={(e) => handleDeviceChange('audio', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
                                            >
                                                {availableDevices.audio.map(device => (
                                                    <option key={device.deviceId} value={device.deviceId}>
                                                        {device.label || `Microphone ${availableDevices.audio.indexOf(device) + 1}`}
                                                    </option>
                                                ))}
                                                {availableDevices.audio.length === 0 && (
                                                    <option value="">No microphones found</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Form section */}
                        <div className="w-full">
                            {isConfiguring ? (
                                <div className="space-y-4 px-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Stream Details</h2>

                                    {/* Title input */}
                                    <div>
                                        <InputField
                                            label="Title"
                                            name="title"
                                            value={data.title}
                                            onChange={handleChange}
                                            placeholder="Enter a title for your live stream"
                                            error={errors.title}
                                            required
                                            disabled={isLive}
                                        />
                                    </div>

                                    {/* Description input */}
                                    <div>
                                        <InputField
                                            label="Description"
                                            name="description"
                                            value={data.description}
                                            onChange={handleChange}
                                            placeholder="Tell viewers what your stream is about"
                                            multiline
                                            rows={4}
                                            error={errors.description}
                                            required
                                            disabled={isLive}
                                        />
                                    </div>

                                    {/* Tags input (simple implementation) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tags (optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tags separated by commas"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            disabled={isLive}
                                            onChange={(e) => {
                                                const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                                                setData(prev => ({ ...prev, tags: tagsArray }));
                                            }}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Add relevant tags to help viewers discover your stream</p>
                                    </div>

                                    {/* Stream tips */}
                                    <div className="mt-6 bg-blue-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for a great stream</h3>
                                        <ul className="text-xs text-blue-700 space-y-1 pl-5 list-disc">
                                            <li>Ensure you have a stable internet connection</li>
                                            <li>Check that your lighting is good and viewers can see you clearly</li>
                                            <li>Test your microphone before going live</li>
                                            <li>Engage with viewers by responding to comments</li>
                                            <li>Stick to a schedule so viewers know when to expect you</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Stream info during broadcast */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h2 className="text-lg font-semibold">{data.title}</h2>
                                            <button
                                                onClick={() => setIsConfiguring(true)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                                <Edit fontSize="small" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600">{data.description}</p>
                                    </div>

                                    {/* Stream stats */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-800 mb-3">Stream Stats</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Duration</p>
                                                <p className="text-lg font-medium">{formatDuration(duration)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Viewers</p>
                                                <p className="text-lg font-medium">{viewerCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className="text-sm font-medium flex items-center">
                                                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                                    Good connection
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Visibility</p>
                                                <p className="text-sm font-medium">{data.isPrivate ? 'Private' : 'Public'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Share section */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-800 mb-2">Share Your Stream</h3>
                                        <div className="flex space-x-2">
                                            <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center">
                                                <Share fontSize="small" className="mr-1" />
                                                Share Link
                                            </button>
                                            <button className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded flex items-center justify-center">
                                                <ScreenShare fontSize="small" className="mr-1" />
                                                Share Screen
                                            </button>
                                        </div>
                                    </div>

                                    {/* Viewer comments placeholder */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-800 mb-2">Viewer Comments</h3>
                                        <div className="h-32 bg-gray-50 rounded-lg border border-gray-200 p-3 overflow-y-auto">
                                            <p className="text-sm text-gray-500 text-center mt-8">Comments will appear here</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateLiveContent;