/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';

const HeaderTabs = ({ tabs, value, handleChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isScrollable, setIsScrollable] = useState(false);

    // Check if tabs need scrolling
    useEffect(() => {
        const checkScrollable = () => {
            if (tabs.length > (isMobile ? 3 : 5)) {
                setIsScrollable(true);
            } else {
                setIsScrollable(false);
            }
        };

        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, [tabs.length, isMobile]);

    // Animation variants for icons
    const iconVariants = {
        selected: {
            scale: 1.2,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        notSelected: {
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    };

    return (
        <Tabs
            value={value}
            onChange={handleChange}
            variant={isScrollable ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="user category tabs"
            textColor="primary"
            centered={!isScrollable && !isMobile}
            indicatorColor="primary"
            sx={{
                // minHeight: isMobile ? 56 : 64,
                // borderRadius: 2,
                backgroundColor: 'white',
                '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: isMobile ? 56 : 64,
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    // padding: isMobile ? '6px 12px' : '12px 16px',
                    transition: 'all 0.3s ease',
                },
                '& .MuiTabs-indicator': {
                    backgroundColor: '#90093A',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                },
                '& .Mui-selected': {
                    color: '#90093A',
                },
                '& .MuiTabs-scroller': {
                    overflow: 'auto !important',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                },
                '& .MuiSvgIcon-root': {
                    fontSize: isMobile ? 24 : 22,
                    transition: '0.3s',
                },
                '& .MuiTabs-flexContainer': {
                    gap: 1
                }
            }}
        >
            {tabs.map((tab, index) => (
                <Tab
                    key={index}
                    icon={
                        <motion.div
                            variants={iconVariants}
                            initial="notSelected"
                            animate={value === index ? "selected" : "notSelected"}
                        >
                            {React.cloneElement(tab.icon, {
                                style: {
                                    color: value === index ? '#90093A' : 'inherit',
                                    fontSize: isMobile ? 28 : 24
                                }
                            })}
                        </motion.div>
                    }
                    iconPosition="start"
                    label={isMobile ? '' : tab.name}
                    aria-label={tab.name}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(144, 9, 58, 0.04)',
                            color: value === index ? '#90093A' : 'rgba(144, 9, 58, 0.7)',
                        },
                    }}
                />
            ))}
        </Tabs>
    );
};

export default HeaderTabs;