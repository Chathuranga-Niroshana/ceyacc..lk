import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2, User } from 'lucide-react';
import { getUserProfile } from '../../features/auth/authSlice';

const ProfileCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser: user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(getUserProfile());
        }
    }, [dispatch, user]);

    // All hooks are above this line!

    if (loading) {
        return (
            <div className="w-full max-w-xs md:max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md bg-white font-sans my-4 flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <span className="text-gray-500">Loading profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-xs md:max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md bg-white font-sans my-4 flex flex-col items-center justify-center py-10">
                <User className="w-8 h-8 text-red-500 mb-2" />
                <span className="text-red-500 mb-2">{error}</span>
                <button
                    onClick={() => dispatch(getUserProfile())}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="w-full max-w-xs md:max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md bg-white font-sans my-4">
            {/* Cover Image */}
            <div className="h-32 w-full relative overflow-hidden bg-gradient-to-r from-blue-200 to-indigo-200">
                <img
                    src={user?.cover_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3"}
                    alt="Cover"
                    className="absolute w-full h-full object-cover"
                />
            </div>
            <div className="p-0 bg-white relative text-center">
                {/* Profile Image */}
                <div className="relative flex justify-center">
                    <div
                        className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shadow-md -mt-10 border-4 border-white mx-auto"
                        style={{
                            backgroundColor: '#f0f0f0',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}>
                        {user?.image ? (
                            <img
                                src={user?.image}
                                alt={user?.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"
                                style={{
                                    backgroundColor: '#e0e0e0',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#666'
                                }}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                            </div>
                        )}
                    </div>
                </div>
                {/* User Details */}
                <div className="mt-2">
                    <h2 className="text-gray-800 font-bold text-lg truncate">{user?.name || 'User'}</h2>
                    <p className="text-gray-500 text-sm truncate">{user?.bio || ''}</p>
                </div>
                {/* Divider Line */}
                <div className="bg-gray-200 h-px my-3" />
                {/* Stats */}
                <div className="flex text-center border-b border-gray-100">
                    <div className="flex-1 border-r border-gray-100 py-2">
                        <div className="text-gray-800 font-bold text-xl">{user?.system_score ?? 0}</div>
                        <div className="text-gray-400 text-xs">Score</div>
                    </div>
                    <div className="flex-1 py-2">
                        <div className="text-gray-800 font-bold text-xl">{user?.level?.name || 'N/A'}</div>
                        <div className="text-gray-400 text-xs">Level</div>
                    </div>
                </div>
                {/* Profile Button */}
                <div className="py-3">
                    <button
                        onClick={() => navigate('/user-profile')}
                        className="text-blue-500 font-bold cursor-pointer bg-transparent border-0 text-base hover:underline"
                    >
                        My Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;