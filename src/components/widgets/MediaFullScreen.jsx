/* eslint-disable no-unused-vars */
import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from 'lucide-react';

const FullScreenModal = ({ isOpen, onClose, mediaType, src, alt }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
                    onClick={onClose}
                >
                    <motion.button
                        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                        whileHover={{ scale: 1.1 }}
                        onClick={onClose}
                    >
                        <XIcon className="h-6 w-6" />
                    </motion.button>

                    {mediaType === 'image' && (
                        <motion.img
                            layoutId={`image-${src}`}
                            src={src}
                            alt={alt}
                            className="max-h-screen max-w-screen-lg object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}

                    {mediaType === 'video' && (
                        <motion.video
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-h-screen max-w-screen-lg"
                            controls
                            autoPlay
                            onClick={(e) => e.stopPropagation()}
                        >
                            <source src={src} type="video/mp4" />
                        </motion.video>
                    )}

                    {mediaType === 'pdf' && (
                        <motion.iframe
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-4/5 h-4/5 bg-white"
                            src={`${src}#view=FitH&toolbar=1&navpanes=1`}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default FullScreenModal