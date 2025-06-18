/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateIcon from '@mui/icons-material/Create';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ProfileCard from '../widgets/ProfileCard';
import { useNavigate } from 'react-router-dom';

// Sidebar Component
const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const menuItems = [
        { id: 'create', label: 'Create Content', path: '/create-content', icon: <CreateIcon /> },
        { id: 'live', label: 'Live Classes', path: '/live', icon: <LiveTvIcon /> },
        { id: 'courses', label: 'Courses', path: '/courses/', icon: <SchoolIcon /> },
        { id: 'quizzes', label: 'Tests / Quizzes', path: '/quizzes', icon: <QuizIcon /> },
        { id: 'papers', label: 'Exam Papers', path: '/papers', icon: <DescriptionIcon /> },
        { id: 'events', label: 'Events', path: '/events', icon: <EventIcon /> },
        // { id: 'schools', label: 'Schools', path: '/schools', icon: <BusinessIcon /> },
        { id: 'jobs', label: 'Jobs', path: '/jobs', icon: <WorkIcon /> },
        { id: 'connect', label: 'Connect To Users', path: '/users/', icon: <PeopleIcon /> },
        // { id: 'leaderboard', label: 'Leader Board', path: '/leader-board', icon: <LeaderboardIcon /> },
        { id: 'settings', label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    ];

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

    const menuItemTextVariants = {
        visible: {
            opacity: 1,
            x: 0,
            display: "block",
            transition: {
                delay: 0.1,
                duration: 0.2
            }
        },
        hidden: {
            opacity: 0,
            x: -10,
            transitionEnd: {
                display: "none"
            },
            transition: {
                duration: 0.2
            }
        }
    };

    const tooltipVariants = {
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                delay: 0.2,
                duration: 0.2
            }
        },
        hidden: {
            opacity: 0,
            x: -10,
            transition: {
                duration: 0.1
            }
        }
    };
    const navigate = useNavigate()

    const handleItemClick = (item) => {
        setActiveItem(item.id);
        navigate(item.path);
    };

    return (
        <motion.div
            className="bg-gray-50 min-h-screen rounded-r-2xl shadow-md z-10 flex flex-col overflow-hidden"
            variants={sidebarVariants}
            initial="expanded"
            animate={collapsed ? "collapsed" : "expanded"}
        >
            {/* Toggle Button */}
            <div className="flex justify-end p-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
                    aria-label="Toggle sidebar"
                >
                    {collapsed ?
                        <KeyboardArrowRightIcon className="text-gray-600" /> :
                        <KeyboardArrowLeftIcon className="text-gray-600" />
                    }
                </button>
            </div>

            {/* Profile Card */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        style={{ padding: 10 }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
                    >
                        <ProfileCard collapsed={collapsed} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Menu */}
            <nav style={{ padding: 2 }} className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-2 gap-5">
                    {menuItems.map((item) => (
                        <motion.li
                            key={item.id}
                            whileHover={{ x: collapsed ? 0 : 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative group flex items-center justify-between"
                            style={{ padding: 2 }}
                        >
                            <button
                                style={{ padding: 10 }}
                                onClick={() => handleItemClick(item)}
                                className={`flex gap-6 items-center p-2 w-full rounded-lg transition-colors duration-200 ${activeItem === item.id ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <span className="text-xl">{item.icon}</span>

                                <motion.span
                                    className="ml-3  font-medium text-sm"
                                    variants={menuItemTextVariants}
                                    initial="visible"
                                    animate={collapsed ? "hidden" : "visible"}
                                >
                                    {item.label}
                                </motion.span>

                                {collapsed && (
                                    <motion.span
                                        className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20"
                                        variants={tooltipVariants}
                                        initial="hidden"
                                        whileHover="visible"
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </nav>
        </motion.div>
    );
};

export default Sidebar;