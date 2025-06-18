/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
// Icons

const StarRating = ({ rating, setRating, interactive = true }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <motion.div
                        key={index}
                        whileHover={{ scale: interactive ? 1.2 : 1 }}
                        whileTap={{ scale: interactive ? 0.9 : 1 }}
                    >
                        <StarIcon
                            className={`h-6 w-6 ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                } ${interactive ? "cursor-pointer" : ""}`}
                            onClick={() => interactive && setRating(ratingValue)}
                            onMouseEnter={() => interactive && setHover(ratingValue)}
                            onMouseLeave={() => interactive && setHover(0)}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};


export default StarRating