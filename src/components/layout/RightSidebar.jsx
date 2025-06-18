/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

// Sidebar Component
const RightSidebar = () => {

    const sidebarVariants = {
        expanded: {
            width: '100%',
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        collapsed: {
            width: '72px',
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };


    return (
        <motion.div
            className="bg-gray-50 min-h-screen rounded-r-2xl shadow-md z-10 flex flex-col overflow-hidden"
            variants={sidebarVariants}
            initial="expanded"
        >

        </motion.div>
    );
};

export default RightSidebar