/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
// Icons
import {
    ThumbUpIcon,
    EmojiHappyIcon,
    HeartIcon,
    FireIcon,
    LightningBoltIcon
} from "@heroicons/react/solid";

const ReactionPicker = ({ onSelect, isOpen, onClose }) => {
    const reactions = [
        { icon: <ThumbUpIcon className="h-6 w-6" />, name: "Like", color: "text-blue-500" },
        { icon: <HeartIcon className="h-6 w-6" />, name: "Love", color: "text-red-500" },
        { icon: <EmojiHappyIcon className="h-6 w-6" />, name: "Haha", color: "text-yellow-500" },
        { icon: <LightningBoltIcon className="h-6 w-6" />, name: "Wow", color: "text-purple-500" },
        { icon: <FireIcon className="h-6 w-6" />, name: "Hot", color: "text-orange-500" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-5 left-0 rounded-full shadow-lg flex pb-0 p-2 pv z-10"
                >
                    {reactions.map((reaction, index) => (
                        <motion.button
                            key={index + 1}
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
export default ReactionPicker