/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import your creation components
import CreatePost from './CreatePost';
import CreateCourse from './CreateCourse';
import CreateEvent from './CreateEvent';
import CreateExamPaper from './CreateExamPaper';
import CreateJob from './CreateJob';
import CreateQuiz from './CreateQuiz';
import CreateLiveContent from './CreateLiveContent';


// Import icons
import DynamicFeedTwoToneIcon from '@mui/icons-material/DynamicFeedTwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';
import CelebrationTwoToneIcon from '@mui/icons-material/CelebrationTwoTone';
import QuizTwoToneIcon from '@mui/icons-material/QuizTwoTone';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';
import LiveTvTwoToneIcon from '@mui/icons-material/LiveTvTwoTone';
import HeaderTabs from '../../components/layout/Tabs';

const tabs = [
    { icon: <DynamicFeedTwoToneIcon />, name: "Post" },
    { icon: <SchoolTwoToneIcon />, name: "Course" },
    { icon: <CelebrationTwoToneIcon />, name: "Event" },
    { icon: <QuizTwoToneIcon />, name: "Quiz" },
    // { icon: <WorkTwoToneIcon />, name: "Job" },
    { icon: <HistoryEduTwoToneIcon />, name: "Exam Paper" },
    // { icon: <LiveTvTwoToneIcon />, name: "Live Content" },
];

const CreateContent = () => {
    const [value, setValue] = useState(() => {
        const savedTab = localStorage.getItem('createContentTab');
        return savedTab ? parseInt(savedTab) : 0;
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem('createContentTab', newValue);
    };

    // Animation variants for content switching
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    // Render the appropriate component based on the selected tab
    const renderContent = () => {
        switch (value) {
            case 0:
                return <CreatePost />;
            case 1:
                return <CreateCourse />;
            case 2:
                return <CreateEvent />;
            case 3:
                return <CreateQuiz />;
            case 4:
                return <CreateJob />;
            case 5:
                return <CreateExamPaper />;
            case 6:
                return <CreateLiveContent />;
            default:
                return <CreatePost />;
        }
    };

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto">
            <div className="sticky top-0 z-10 bg-white pb-4 pt-2">
                <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
                    Create New Content
                </h1>

                <div className="flex flex-row w-full justify-center items-center mb-6">
                    <HeaderTabs tabs={tabs} value={value} handleChange={handleChange} />
                </div>

                <div className="w-full max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-2">
                        {tabs[value].icon}
                        <h2 className="text-xl font-semibold text-gray-700">
                            Create {tabs[value].name}
                        </h2>
                    </div>

                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.5 }}
                        ></motion.div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CreateContent;