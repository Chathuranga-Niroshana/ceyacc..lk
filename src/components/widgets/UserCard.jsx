/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Person,
    School,
    Email,
    Cake,
    EmojiEvents,
    LocationCity,
    Book,
    WorkHistory,
    Verified,
    PersonAdd,
    PersonRemove,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';

const UserCard = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const toggleFollow = () => setIsFollowing(!isFollowing);
    const toggleExpand = () => setExpanded(!expanded);

    // Define role and sex labels
    const roleLabels = {
        1: 'Student',
        2: 'Teacher'
    };

    // Card animations
    const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } }
    };

    // Button animations
    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    // Details animations
    const detailsVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
        >
            {/* Cover Image */}
            <div className="h-32 w-full relative bg-blue-100">
                {user.coverImage && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/30">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${user.coverImage})` }}></div>
                    </div>
                )}
            </div>

            <div className="px-6 py-4 relative">
                {/* Profile Image */}
                <div className="absolute -top-16 left-6 w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100">
                            <Person className="text-blue-500" style={{ fontSize: 40 }} />
                        </div>
                    )}
                </div>

                {/* Follow Button */}
                <motion.button
                    className={`absolute top-2 right-6 px-4 py-2 rounded-full flex items-center gap-2 ${isFollowing ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}
                    onClick={toggleFollow}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    {isFollowing ? (
                        <>
                            <PersonRemove fontSize="small" />
                            <span>Unfollow</span>
                        </>
                    ) : (
                        <>
                            <PersonAdd fontSize="small" />
                            <span>Follow</span>
                        </>
                    )}
                </motion.button>

                {/* Basic Info */}
                <div className="mt-10">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        {user.isVerified && (
                            <Verified className="text-blue-500" fontSize="small" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">
                            {roleLabels[user.role] || 'User'}
                        </span>
                        <span className="text-sm">{user.city}, {user.province}</span>
                    </div>

                    <p className="mt-2 text-gray-600">{user.bio}</p>

                    {/* Stats */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-blue-600">{user.score}</span>
                            <span className="text-xs text-gray-500">Score</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-green-600">Lvl {user.level}</span>
                            <span className="text-xs text-gray-500">Level</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-purple-600">{user.role === 2 ? (user.subjectsTaught?.length || 0) : 'G' + user.grade?.replace('Grade ', '')}</span>
                            <span className="text-xs text-gray-500">{user.role === 2 ? 'Subjects' : 'Grade'}</span>
                        </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <motion.button
                        className="mt-4 w-full flex items-center justify-center gap-1 text-blue-600 py-2 hover:bg-blue-50 rounded-md"
                        onClick={toggleExpand}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {expanded ? (
                            <>
                                <span>Show less</span>
                                <ExpandLess fontSize="small" />
                            </>
                        ) : (
                            <>
                                <span>Show more</span>
                                <ExpandMore fontSize="small" />
                            </>
                        )}
                    </motion.button>

                    {/* Expanded Details */}
                    <motion.div
                        className="overflow-hidden"
                        variants={detailsVariants}
                        initial="hidden"
                        animate={expanded ? "visible" : "hidden"}
                    >
                        <div className="pt-4 border-t mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <School className="text-blue-500" fontSize="small" />
                                <div>
                                    <div className="text-sm font-medium">School</div>
                                    <div className="text-gray-600">{user.schoolName}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Email className="text-blue-500" fontSize="small" />
                                <div>
                                    <div className="text-sm font-medium">Email</div>
                                    <div className="text-gray-600">{user.email}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Cake className="text-blue-500" fontSize="small" />
                                <div>
                                    <div className="text-sm font-medium">Date of Birth</div>
                                    <div className="text-gray-600">{new Date(user.dob).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <LocationCity className="text-blue-500" fontSize="small" />
                                <div>
                                    <div className="text-sm font-medium">Location</div>
                                    <div className="text-gray-600">{user.city}, {user.district}</div>
                                </div>
                            </div>

                            {user.role === 2 && user.subjectsTaught && (
                                <div className="flex items-center gap-2">
                                    <Book className="text-blue-500" fontSize="small" />
                                    <div>
                                        <div className="text-sm font-medium">Subjects Taught</div>
                                        <div className="text-gray-600">{user.subjectsTaught.join(', ')}</div>
                                    </div>
                                </div>
                            )}

                            {user.role === 2 && user.teachingExperience && (
                                <div className="flex items-center gap-2">
                                    <WorkHistory className="text-blue-500" fontSize="small" />
                                    <div>
                                        <div className="text-sm font-medium">Experience</div>
                                        <div className="text-gray-600">{user.teachingExperience}</div>
                                    </div>
                                </div>
                            )}

                            {user.role === 1 && user.grade && (
                                <div className="flex items-center gap-2">
                                    <Book className="text-blue-500" fontSize="small" />
                                    <div>
                                        <div className="text-sm font-medium">Grade</div>
                                        <div className="text-gray-600">{user.grade}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <EmojiEvents className="text-blue-500" fontSize="small" />
                                <div>
                                    <div className="text-sm font-medium">Joined</div>
                                    <div className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserCard;