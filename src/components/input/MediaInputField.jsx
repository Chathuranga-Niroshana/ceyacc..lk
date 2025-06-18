/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudUpload,
    Image,
    VideoLibrary,
    PictureAsPdf,
    InsertDriveFile,
    Close,
    AddPhotoAlternate,
    HighlightOff,
    ErrorOutline
} from '@mui/icons-material';

const MediaUpload = ({ onChange, maxFiles = 5, accept = "image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Handle file addition
    const handleFiles = useCallback((newFiles) => {
        // Reset error
        setError('');

        // Convert FileList to array
        const fileArray = Array.from(newFiles);

        // Check if adding these files would exceed the limit
        if (files.length + fileArray.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        // Check file types and sizes
        const validFiles = fileArray.filter(file => {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('Some files exceed the 10MB size limit.');
                return false;
            }

            // Check if file type is acceptable
            const fileType = file.type.split('/')[0];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            const validTypes = ['image', 'video', 'application'];
            const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

            if (validTypes.includes(fileType) || validExtensions.includes(fileExtension)) {
                return true;
            } else {
                setError('Some files have unsupported formats.');
                return false;
            }
        });

        // Add new valid files
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);

        // Call onChange prop with updated files
        if (onChange) {
            onChange(updatedFiles);
        }
    }, [files, maxFiles, onChange]);

    // Handle file drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    // Handle drag events
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle file input change
    const handleFileInputChange = useCallback((e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
        // Reset file input to allow selecting the same file again
        e.target.value = '';
    }, [handleFiles]);

    // Handle removing a file
    const handleRemoveFile = useCallback((indexToRemove) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);

        // Call onChange prop with updated files
        if (onChange) {
            onChange(updatedFiles);
        }
    }, [files, onChange]);

    // Get appropriate icon for file type
    const getFileIcon = (file) => {
        const fileType = file.type.split('/')[0];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        switch (fileType) {
            case 'image':
                return <Image />;
            case 'video':
                return <VideoLibrary />;
            case 'application':
                if (file.type === 'application/pdf') {
                    return <PictureAsPdf />;
                }
                return <InsertDriveFile />;
            default:
                if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension)) {
                    return <InsertDriveFile />;
                }
                return <InsertDriveFile />;
        }
    };

    // Render file preview
    const renderFilePreview = (file, index) => {
        const fileType = file.type.split('/')[0];

        return (
            <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col items-center border rounded-lg p-2 bg-white shadow-sm"
                style={{ width: '120px', height: '140px' }}
            >
                <div className="flex items-center justify-center h-24 w-full overflow-hidden rounded-md bg-gray-100">
                    {fileType === 'image' ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-full w-full object-cover"
                        />
                    ) : fileType === 'video' ? (
                        <video
                            src={URL.createObjectURL(file)}
                            className="h-full w-full object-cover"
                        />
                    ) : file.type === 'application/pdf' ? (
                        <div className="flex flex-col items-center justify-center text-red-500 h-full w-full">
                            <PictureAsPdf fontSize="large" />
                            <span className="text-xs mt-1">PDF</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-blue-500 h-full w-full">
                            {getFileIcon(file)}
                            <span className="text-xs mt-1">{file.name.split('.').pop().toUpperCase()}</span>
                        </div>
                    )}
                </div>

                <div className="w-full mt-2 text-center">
                    <p className="text-xs text-gray-600 truncate" title={file.name}>
                        {file.name.length > 15 ? `${file.name.substring(0, 12)}...` : file.name}
                    </p>
                </div>

                <motion.button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                    onClick={() => handleRemoveFile(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <HighlightOff fontSize="small" />
                </motion.button>
            </motion.div>
        );
    };

    return (
        <div className="w-full">
            {/* Main upload area */}
            <div
                className={`relative border-2 border-dashed w-full rounded-lg p-6 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept={accept}
                    multiple
                    className="hidden"
                    disabled={files.length >= maxFiles}
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                        animate={{
                            y: isDragging ? [-10, 0, -10] : 0,
                            scale: isDragging ? 1.05 : 1
                        }}
                        transition={{
                            y: { repeat: Infinity, duration: 1.5 },
                            scale: { duration: 0.2 }
                        }}
                        className="text-blue-500 mb-4"
                    >
                        <CloudUpload style={{ fontSize: 48 }} />
                    </motion.div>

                    <h3 className="mb-2 text-lg font-medium text-gray-700">
                        {files.length >= maxFiles ? (
                            "Maximum files reached"
                        ) : (
                            isDragging ? "Drop files here" : "Upload your media"
                        )}
                    </h3>

                    {files.length < maxFiles && (
                        <p className="mb-3 text-sm text-gray-500">
                            Drag & drop files or <span className="text-blue-500 font-medium">browse</span> to upload
                        </p>
                    )}

                    <p className="text-xs text-gray-400">
                        {files.length < maxFiles ? (
                            <>
                                Supports images, videos, PDFs, and documents
                                <br />
                                Maximum {maxFiles} files, 10MB per file
                            </>
                        ) : (
                            "Remove some files to upload more"
                        )}
                    </p>
                </div>

                {/* Full overlay when dragging */}
                {isDragging && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none rounded-lg flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <p className="text-blue-500 font-medium">Release to upload files</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 text-sm text-red-500 flex items-center gap-1"
                    >
                        <ErrorOutline fontSize="small" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Files preview */}
            {files.length > 0 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-md font-medium text-gray-700">
                            Uploaded Media ({files.length}/{maxFiles})
                        </h4>
                        {files.length > 0 && (
                            <motion.button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFiles([]);
                                    if (onChange) onChange([]);
                                }}
                                className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Close fontSize="small" />
                                Clear All
                            </motion.button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {files.map((file, index) => renderFilePreview(file, index))}

                            {/* Add more button if not at max */}
                            {files.length < maxFiles && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 bg-gray-50 cursor-pointer"
                                    style={{ width: '120px', height: '140px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current.click();
                                    }}
                                >
                                    <AddPhotoAlternate style={{ fontSize: 32 }} className="text-gray-400" />
                                    <p className="text-xs text-gray-500 mt-2">Add Media</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaUpload;