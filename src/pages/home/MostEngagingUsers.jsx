/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MostEngagingUserCard from '../../components/widgets/MostEngagingUserCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMostEngagingUsers } from '../../features/users/usersSlice';

const MostEngagingUsers = () => {

    const dispatch = useDispatch()
    const { mostEngagingUsers, loading, error } = useSelector((state) => state.users);


    useEffect(() => {
        dispatch(fetchMostEngagingUsers());
    }, [dispatch]);

    const sortedUsers = useMemo(() => {
        return [...mostEngagingUsers]
            .sort((a, b) => b.todayScore - a.todayScore)
            .slice(0, 5);
    }, [mostEngagingUsers]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto"
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                style={{ padding: '1rem' }}
            >
                {sortedUsers.map((user) => (
                    <MostEngagingUserCard key={user.id} user={user} />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default MostEngagingUsers;