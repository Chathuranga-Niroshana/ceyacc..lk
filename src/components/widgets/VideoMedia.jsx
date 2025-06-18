/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const VideoMedia = ({ src, openFullScreen }) => (
    <div className="relative group rounded-lg overflow-hidden">
        <video
            className="w-full max-h-96 rounded-lg cursor-pointer"
            controls
            onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
        >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <motion.div
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={openFullScreen}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                <path d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z" />
            </svg>
        </motion.div>
    </div>
);

export default VideoMedia