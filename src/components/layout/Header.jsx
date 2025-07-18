/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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

const themeColors = {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    accent: '#f59e0b',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    text: '#1f2937',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

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
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: i => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: "easeOut"
        }
    })
};

const mobileMenuVariants = {
    closed: {
        opacity: 0,
        scale: 0.95,
        y: -10,
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
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const Header = () => {
    const { Search } = Input;
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

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

    return (
        <>
            <motion.header
                className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                style={{ boxShadow: themeColors.shadow }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center"
                                >
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="w-10 h-10 object-contain"
                                    />
                                </motion.div>
                            </Link>
                        </div>

                        {/* Desktop Search */}
                        <div className="hidden lg:block flex-1 max-w-md mx-8">
                            <Search
                                placeholder="Search anything..."
                                onSearch={onSearch}
                                enterButton
                                size="large"
                                className="custom-search-input"
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {pages.map((page, index) => {
                                const isActive = location.pathname === page.path;
                                return (
                                    <motion.div
                                        key={page.id}
                                        custom={index}
                                        variants={navItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to={page.path}
                                            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 group
                                                ${isActive
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="text-xl mb-1 transition-transform duration-200 group-hover:scale-110">
                                                {React.cloneElement(page.icon, {
                                                    fontSize: 'inherit',
                                                    className: isActive ? 'text-blue-600' : 'text-current'
                                                })}
                                            </div>
                                            <span className="text-xs font-medium">{page.name}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Mobile Navigation Icons */}
                        <div className="lg:hidden flex items-center space-x-2">
                            {/* Show the first 3 nav items directly in the header */}
                            {pages.slice(0, 3).map((page) => {
                                const isActive = location.pathname === page.path;
                                return (
                                    <Link
                                        key={page.id}
                                        to={page.path}
                                        className={`p-2 rounded-full transition-all duration-200
                                            ${isActive
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-2xl">
                                            {React.cloneElement(page.icon, { fontSize: 'inherit' })}
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Mobile Search Toggle Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleMobileSearch}
                                className={`p-2 rounded-full transition-all duration-200
                                    ${showSearch
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                aria-label="Toggle Search"
                            >
                                <SearchIcon style={{ fontSize: '1.5rem' }} />
                            </motion.button>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleMobileMenu}
                                className={`p-2 rounded-full transition-all duration-200
                                    ${mobileMenuOpen
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? (
                                    <CloseIcon style={{ fontSize: '1.5rem' }} />
                                ) : (
                                    <MenuIcon style={{ fontSize: '1.5rem' }} />
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    {showSearch && (
                        <motion.div
                            className="lg:hidden px-4 py-3 border-t border-gray-100"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <Search
                                placeholder="Search anything..."
                                onSearch={onSearch}
                                enterButton
                                size="large"
                                className="custom-search-input"
                            />
                        </motion.div>
                    )}

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <motion.nav
                            className="lg:hidden border-t border-gray-100"
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <div className="grid grid-cols-3 gap-2 p-4">
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
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
                                                    ${isActive
                                                        ? 'text-blue-600 bg-blue-50 shadow-sm'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-2">{page.icon}</div>
                                                <span className="text-sm font-medium">{page.name}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.nav>
                    )}
                </div>
            </motion.header>

            {/* Custom CSS for Ant Design Search component */}
            <style jsx="true">{`
                .custom-search-input .ant-input {
                    height: 44px;
                    border-color: #e5e7eb;
                    background-color: #f9fafb;
                    color: #1f2937;
                    border-radius: 12px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 14px;
                }
                
                .custom-search-input .ant-input:hover {
                    border-color: #d1d5db;
                    background-color: #ffffff;
                }
                
                .custom-search-input .ant-input:focus {
                    border-color: #3b82f6;
                    background-color: #ffffff;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .custom-search-input .ant-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
                    border-color: #3b82f6 !important;
                    border-radius: 0 12px 12px 0 !important;
                    height: 44px !important;
                    min-width: 60px !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .custom-search-input .ant-btn:hover,
                .custom-search-input .ant-btn:focus {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
                    border-color: #2563eb !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
                }
                
                .custom-search-input .ant-btn:active {
                    transform: translateY(0);
                }
                
                .custom-search-input .ant-input-search-button {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                .custom-search-input .ant-input-group-addon {
                    background: none !important;
                    border: none !important;
                    padding: 0 !important;
                }
                
                .custom-search-input .ant-input-group {
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }
            `}</style>
        </>
    );
};

export default Header;