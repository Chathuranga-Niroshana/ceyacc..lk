/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { BookCopyIcon } from "lucide-react";


const PdfMedia = ({ src, openFullScreen }) => {
    return (
        <div
            className="relative w-full bg-gray-100 rounded-lg p-4 cursor-pointer group"
            onClick={openFullScreen}
        >
            <div className="flex items-center">
                <BookCopyIcon className="h-12 w-12 text-red-500" />
                <div className="ml-4">
                    <h3 className="font-medium">{src.split('/').pop()}</h3>
                    <p className="text-sm text-gray-500">PDF Document - Click to view</p>
                </div>
            </div>
            <motion.div
                className="absolute top-0 right-0 bottom-0 left-0 bg-black rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"
                whileHover={{ opacity: 0.1 }}
            />
        </div>
    )
};

export default PdfMedia