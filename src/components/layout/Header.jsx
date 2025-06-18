/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Input } from 'antd';
import { motion } from 'framer-motion';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import ImportContactsTwoToneIcon from '@mui/icons-material/ImportContactsTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import ModeCommentTwoToneIcon from '@mui/icons-material/ModeCommentTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const pages = [
    { id: 1, name: 'Home', icon: <HomeTwoToneIcon />, path: '/' },
    { id: 2, name: 'Library', icon: <ImportContactsTwoToneIcon />, path: '/library' },
    { id: 3, name: 'Users', icon: <PeopleAltTwoToneIcon />, path: '/users' },
    { id: 4, name: 'Messages', icon: <ModeCommentTwoToneIcon />, path: '/messages' },
    { id: 5, name: 'Notifications', icon: <NotificationsNoneTwoToneIcon />, path: '/notifications' },
    { id: 6, name: 'Profile', icon: <AccountCircleTwoToneIcon />, path: '/profile' },
];

// Animation variants
const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: i => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
            ease: "easeOut"
        }
    })
};

const mobileMenuVariants = {
    closed: {
        opacity: 0,
        scale: 0.95,
        y: -20,
        transition: {
            duration: 0.2
        }
    },
    open: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const Header = () => {
    const { Search } = Input;
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Initialize dark mode based on user preference or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleMobileSearch = () => {
        setShowSearch(!showSearch);
    };

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        setShowSearch(false);
    };

    // Custom styling for Ant Design Search component
    const searchStyle = {
        width: '100%',
        maxWidth: '320px',
    };

    // Dynamic button style based on dark mode
    const searchButtonStyle = {
        backgroundColor: darkMode ? '#6D28D9' : '#90093A', // Purple for dark mode, Maroon for light mode
        borderColor: darkMode ? '#6D28D9' : '#90093A',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px'
    };

    // Get theme colors
    const getThemeColors = () => {
        return {
            bg: darkMode ? 'bg-gray-900' : 'bg-white',
            text: darkMode ? 'text-white' : 'text-gray-800',
            border: darkMode ? 'border-gray-700' : 'border-gray-200',
            accent: darkMode ? 'text-purple-500' : 'text-rose-700',
            accentHover: darkMode ? 'hover:text-purple-400' : 'hover:text-rose-600',
            accentBg: darkMode ? 'bg-purple-600' : 'bg-rose-700',
            accentBgHover: darkMode ? 'hover:bg-purple-700' : 'hover:bg-rose-800',
            navHover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
        };
    };

    const themeColors = getThemeColors();

    return (
        <motion.header
            className={` top-0 fixed w-full z-50 shadow ${themeColors.bg} ${themeColors.text} transition-colors duration-300`}
            variants={headerVariants}
            initial="hidden"
            animate="visible"
        // style={{ padding: 10, }}
        >
            <div className="mx-auto">
                <div className="flex justify-between items-center px-4 py-1 ">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={logo} alt="Logo" className="w-12 md:w-16 object-contain" />
                            </motion.div>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden lg:block flex-1 max-w-lg mx-8">
                        <Search
                            placeholder="Search..."
                            onSearch={onSearch}
                            enterButton
                            size="large"
                            style={searchStyle}
                            className="custom-search-input"
                            buttonStyle={searchButtonStyle}
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {pages.map((page, index) => {
                            const isActive = location.pathname === page.path;
                            return (
                                <motion.div
                                    key={page.id}
                                    style={{ padding: 10 }}
                                    custom={index}
                                    variants={navItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to={page.path}
                                        className={`flex flex-col items-center justify-center p-2 mx-1 rounded-lg transition-colors duration-200 
                                        ${isActive
                                                ? themeColors.accent
                                                : `${themeColors.text} ${themeColors.accentHover}`
                                            }`}
                                    >
                                        <div style={{
                                            fontSize: '1.75rem', // Bigger icons on desktop
                                            color: isActive ? (darkMode ? '#6D28D9' : '#90093A') : 'inherit',
                                            transition: 'color 0.3s, font-size 0.3s',
                                        }} className="text-3xl">
                                            {React.cloneElement(page.icon, { fontSize: 'inherit' })}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        {/* Dark Mode Toggle Button */}
                        {/* <motion.button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full ${themeColors.navHover} transition-colors duration-200`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {darkMode ? (
                                <Brightness7Icon style={{ fontSize: '2.5rem', color: '#FCD34D' }} />
                            ) : (
                                <Brightness4Icon style={{ fontSize: '2.5rem', color: '#4B5563' }} />
                            )}
                        </motion.button> */}
                    </nav>

                    {/* Mobile Navigation Icons */}
                    <div className="lg:hidden flex items-center gap-4">
                        {/* Show the first 3 nav items directly in the header */}
                        {pages.slice(0, 3).map((page) => {
                            const isActive = location.pathname === page.path;
                            return (
                                <Link
                                    key={page.id}
                                    to={page.path}
                                    className={`${isActive ? themeColors.accent : themeColors.text}`}
                                >
                                    <div style={{
                                        fontSize: '2rem',
                                        color: isActive ? (darkMode ? '#6D28D9' : '#90093A') : 'inherit',
                                    }}>
                                        {React.cloneElement(page.icon, { fontSize: 'inherit' })}
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Mobile Search Toggle Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMobileSearch}
                            className={`p-2 rounded-full ${themeColors.navHover} ${themeColors.text}`}
                            aria-label="Toggle Search"
                        >
                            <SearchIcon style={{ fontSize: '2rem' }} />
                        </motion.button>

                        {/* Dark Mode Toggle Button */}
                        {/* <motion.button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full ${themeColors.navHover} transition-colors duration-200`}
                            whileTap={{ scale: 0.9 }}
                            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {darkMode ? (
                                <Brightness7Icon style={{ fontSize: '2rem', color: '#FCD34D' }} />
                            ) : (
                                <Brightness4Icon style={{ fontSize: '2rem', color: '#4B5563' }} />
                            )}
                        </motion.button> */}

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMobileMenu}
                            className={`p-2 rounded-full ${themeColors.navHover} ${themeColors.text}`}
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <CloseIcon style={{ fontSize: '2rem' }} />
                            ) : (
                                <MenuIcon style={{ fontSize: '2rem' }} />
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Search - Only shown when search toggled */}
                {showSearch && (
                    <motion.div
                        className="px-4 py-3 border-t border-b lg:hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Search
                            placeholder="Search..."
                            onSearch={onSearch}
                            enterButton
                            style={{ width: '100%' }}
                            className="custom-search-input"
                            buttonStyle={searchButtonStyle}
                        />
                    </motion.div>
                )}

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <motion.nav
                        className={`lg:hidden border-t ${themeColors.border}`}
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="grid grid-cols-3 gap-1 p-2">
                            {/* Show all nav items in the dropdown */}
                            {pages.map((page, index) => {
                                const isActive = location.pathname === page.path;
                                return (
                                    <motion.div
                                        key={page.id}
                                        variants={navItemVariants}
                                        custom={index}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link
                                            to={page.path}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors duration-200
                                            ${isActive
                                                    ? `text-white ${themeColors.accentBg}`
                                                    : `${themeColors.text} ${themeColors.accentHover} ${themeColors.navHover}`
                                                }`}
                                        >
                                            <div className="text-2xl">{page.icon}</div>
                                            <span className="text-xs font-medium mt-1">{page.name}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.nav>
                )}
            </div>

            {/* Custom CSS for Ant Design Search component */}
            <style jsx="true">{`
                .custom-search-input .ant-input {
                    height: 40px;
                    border-color: ${darkMode ? '#4B5563' : '#e0e0e0'};
                    background-color: ${darkMode ? '#1F2937' : 'white'};
                    color: ${darkMode ? 'white' : 'black'};
                    transition: all 0.3s;
                }
                
                .custom-search-input .ant-input:hover,
                .custom-search-input .ant-input:focus {
                    border-color: ${darkMode ? '#6D28D9' : '#90093A'};
                    box-shadow: 0 0 0 2px ${darkMode ? 'rgba(109, 40, 217, 0.2)' : 'rgba(144, 9, 58, 0.1)'};
                }
                
                .custom-search-input .ant-btn {
                    background-color: ${darkMode ? '#6D28D9' : '#90093A'} !important;
                    border-color: ${darkMode ? '#6D28D9' : '#90093A'} !important;
                }
                
                .custom-search-input .ant-btn:hover,
                .custom-search-input .ant-btn:focus {
                    background-color: ${darkMode ? '#5B21B6' : '#7d0832'} !important;
                    border-color: ${darkMode ? '#5B21B6' : '#7d0832'} !important;
                }

                /* Add these styles to your CSS or tailwind */
                .dark {
                    color-scheme: dark;
                }
            `}</style>
        </motion.header>
    );
};

export default Header;