/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const ImageMedia = ({ src, alt, openFullScreen }) => {
  return (
    <div className="relative group cursor-pointer" onClick={openFullScreen}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full rounded-lg object-cover max-h-96"
        layoutId={`image-${src}`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center rounded-lg">
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm"
        >
          Click to expand
        </motion.div>
      </div>
    </div>
  )
};


export default ImageMedia;