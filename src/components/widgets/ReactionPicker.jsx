/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ThumbsUp,
    Heart,
    Smile,
    Zap,
    Flame
} from "lucide-react";

const ReactionPicker = ({ onSelect, isOpen, onClose }) => {
    const reactions = [
        { icon: <ThumbsUp className="h-6 w-6" />, name: "Like", color: "text-blue-500" },
        { icon: <Heart className="h-6 w-6" />, name: "Love", color: "text-red-500" },
        { icon: <Smile className="h-6 w-6" />, name: "Haha", color: "text-yellow-500" },
        { icon: <Zap className="h-6 w-6" />, name: "Wow", color: "text-purple-500" },
        { icon: <Flame className="h-6 w-6" />, name: "Hot", color: "text-orange-500" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-5 left-0 rounded-full shadow-lg flex pb-0 p-2 z-10 bg-white"
                >
                    {reactions.map((reaction, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`mx-2 flex flex-col items-center ${reaction.color}`}
                            onClick={() => {
                                onSelect(reaction.name);
                                onClose();
                            }}
                        >
                            {reaction.icon}
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReactionPicker;
