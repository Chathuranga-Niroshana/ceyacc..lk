import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, logout } from '../../features/auth/authSlice';
import {
    User, Mail, Phone, Calendar, MapPin, School, Award, BookOpen, GraduationCap,
    Verified, Star, Users, Clock, Loader2,
    LogOutIcon
} from 'lucide-react';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { userProfile, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userProfile) dispatch(getUserProfile());
    }, [dispatch, userProfile]);

    // Role detection
    const isTeacher = !!userProfile?.teacher;
    const isStudent = !!userProfile?.student;

    // Helper functions
    const formatDate = (dateString) =>
        dateString
            ? new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : 'N/A';

    const getScoreColor = (score) => {
        if (score >= 500) return 'from-emerald-400 to-teal-500';
        if (score >= 200) return 'from-blue-400 to-indigo-500';
        if (score >= 100) return 'from-amber-400 to-orange-500';
        return 'from-rose-400 to-pink-500';
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-700 text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="text-center bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => dispatch(getUserProfile())}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!userProfile) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6">
            {/* Profile Header */}
            <div className="max-w-4xl mx-auto mb-6 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
                        <p className="text-gray-600">
                            {`Welcome back, ${userProfile.name || 'User'}!`}
                        </p>
                    </div>
                    <button
                        onClick={() => dispatch(getUserProfile())}
                        disabled={loading}
                        className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg transition-colors flex items-center gap-2 shadow-md border border-gray-200"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                        Refresh
                    </button>
                    <button
                        onClick={() => dispatch(logout())}
                        disabled={loading}
                        className="px-4 py-2 bg-red-400/80 hover:bg-red-400 text-gray-700 rounded-lg transition-colors flex items-center gap-2 shadow-md border border-gray-200"
                    >
                        <LogOutIcon />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Container - Column Layout */}
            <div className="max-w-4xl mx-auto px-4 space-y-8">

                {/* Cover & Profile Section */}
                <div className="relative">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl relative overflow-hidden shadow-lg">
                        <img
                            src={userProfile.cover_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3"}
                            alt="Cover"
                            className="absolute w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-white/10"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>

                        {/* Floating Elements */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            {userProfile.is_verified && (
                                <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 border border-white/20">
                                    <Verified className="w-5 h-5 text-emerald-600" />
                                </div>
                            )}
                            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 border border-white/20">
                                {userProfile.level?.image ? (
                                    <img src={userProfile.level.image} alt="Level" className="w-5 h-5" />
                                ) : (
                                    <Star className="w-5 h-5 text-yellow-600" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Image & Basic Info */}
                    <div className="relative -mt-12 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 px-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {userProfile.image ? (
                                    <img
                                        src={userProfile.image}
                                        alt={userProfile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                                        {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            {userProfile.is_verified && (
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                                    <Verified className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.name}</h2>
                            <p className="text-gray-600 mb-3">{userProfile.bio}</p>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isTeacher
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : isStudent
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}>
                                    {isTeacher ? 'Teacher' : isStudent ? 'Student' : 'User'}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-200">
                                    {userProfile.level?.name || 'No Level'}
                                </div>
                            </div>
                        </div>

                        {/* Score Badge */}
                        <div className={`bg-gradient-to-r ${getScoreColor(userProfile.system_score)} rounded-xl p-4 shadow-lg text-center`}>
                            <div className="text-2xl font-bold text-white">{userProfile.system_score}</div>
                            <div className="text-xs text-white/90 uppercase tracking-wide">Score</div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="font-medium">{userProfile.email || 'No email provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Phone className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Phone</div>
                                <div className="font-medium">{userProfile.mobile_no || 'No phone provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Date of Birth</div>
                                <div className="font-medium">{userProfile.dob ? formatDate(userProfile.dob) : 'No date provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Address</div>
                                <div className="font-medium">
                                    {userProfile.address_line_one && userProfile.city
                                        ? `${userProfile.address_line_one}, ${userProfile.city}`
                                        : 'No address provided'
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700 md:col-span-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <School className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">School</div>
                                <div className="font-medium">{userProfile.school_name || 'No school provided'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Stats Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        Profile Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{userProfile.system_score}</div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">System Score</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                                {userProfile.is_verified ? '✓' : '✗'}
                            </div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">Verified Status</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                            <div className="text-lg font-bold text-purple-600 mb-2">{userProfile.level?.name || 'No Level'}</div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">Current Level</div>
                        </div>
                    </div>
                </div>

                {/* Role-specific Information */}
                {isTeacher && (
                    <>
                        {/* Teaching Information */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <GraduationCap className="w-6 h-6 text-emerald-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Teaching Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-700 font-medium">Subjects Taught</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {userProfile.teacher.subjects_taught?.map((subject, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg text-sm border border-blue-200 font-medium"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Clock className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-700 font-medium">Teaching Experience</span>
                                    </div>
                                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-lg border border-emerald-200 font-medium">
                                        {userProfile.teacher.teaching_experience}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teacher Achievements */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <Award className="w-6 h-6 text-yellow-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Achievements & Recognition</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 text-center">
                                    <Star className="w-10 h-10 text-yellow-600 mb-3 mx-auto" />
                                    <div className="text-gray-900 font-semibold mb-1">{userProfile.level?.name || 'No Level'}</div>
                                    <div className="text-gray-600 text-sm">Current Level</div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 text-center">
                                    <Users className="w-10 h-10 text-emerald-600 mb-3 mx-auto" />
                                    <div className="text-gray-900 font-semibold mb-1">Educator</div>
                                    <div className="text-gray-600 text-sm">Teaching Role</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-center">
                                    <Verified className="w-10 h-10 text-blue-600 mb-3 mx-auto" />
                                    <div className="text-gray-900 font-semibold mb-1">Verified</div>
                                    <div className="text-gray-600 text-sm">Profile Status</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {isStudent && (
                    <>
                        {/* Academic Information */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Academic Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <GraduationCap className="w-5 h-5 text-purple-600" />
                                        <span className="text-gray-700 font-medium">Current Grade</span>
                                    </div>
                                    <div className="px-4 py-4 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-lg text-2xl font-bold border border-purple-200 text-center">
                                        Grade {userProfile.student.grade}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Award className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-700 font-medium">Completion Status</span>
                                    </div>
                                    <div className={`px-4 py-4 rounded-lg text-center font-semibold ${userProfile.student.is_completed
                                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
                                        }`}>
                                        {userProfile.student.is_completed ? 'Completed' : 'In Progress'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Student Progress & Achievements */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <Star className="w-6 h-6 text-yellow-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Progress & Achievements</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">{userProfile.system_score}</div>
                                        <div className="text-gray-700 font-medium mb-1">System Score</div>
                                        <div className="text-xs text-gray-500">Total Points</div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">{userProfile.student.grade}</div>
                                        <div className="text-gray-700 font-medium mb-1">Current Grade</div>
                                        <div className="text-xs text-gray-500">Academic Level</div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                                    <div className="text-center">
                                        {userProfile.level?.image ? (
                                            <img src={userProfile.level.image} alt="Level" className="w-12 h-12 mx-auto mb-2" />
                                        ) : (
                                            <Star className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                                        )}
                                        <div className="text-gray-700 font-medium mb-1">{userProfile.level?.name || 'No Level'}</div>
                                        <div className="text-xs text-gray-500">Current Rank</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;