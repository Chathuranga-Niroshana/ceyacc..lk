/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { getColorForScore } from '../../utils/getColorForScore';
import SafeImage from './SafeImage';

const MostEngagingUserCard = ({ user }) => {

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="relative"
        >
            <div className="z-10 flex flex-col items-center">
                <div className="relative">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="rounded-full p-1">
                            <SafeImage
                                src={user.image}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-[#90093A]"
                                width={96}
                                height={96}
                            />
                        </div>
                    </motion.div>
                </div>

                <h2
                    className="mt-4 text-sm font-semibold text-gray-800 max-w-[6rem] truncate overflow-hidden whitespace-nowrap text-center"
                    title={user.name}
                >
                    {user.name}
                </h2>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 mt-2 rounded-full"
                    style={{ background: getColorForScore(user.todayScore) }}
                />
            </div>
        </motion.div>
    );
};

export default MostEngagingUserCard;