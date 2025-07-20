import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
    Eye,
    FileText,
    School,
    Calendar,
    BookOpen,
    Star,
    ChevronDown,
    ChevronUp,
    Clock,
    GraduationCap,
    MapPin,
    FileImage,
    ExternalLink
} from 'lucide-react';
import { fetchExamPapers } from '../../features/examPapers/examPapersSlice';

// Material-UI inspired loading component
const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-6 h-6',
        large: 'w-8 h-8'
    };

    const colorClasses = {
        primary: 'text-blue-600',
        white: 'text-white',
        gray: 'text-gray-400'
    };

    return (
        <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${colorClasses[color]}`}>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

// Skeleton loader for exam papers
const ExamPaperSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex gap-2">
                <div className="w-20 h-9 bg-gray-200 rounded-lg"></div>
                <div className="w-24 h-9 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    </div>
);

const ExamPapers = () => {
    const dispatch = useDispatch();
    const { allExamPapers, loading, error } = useSelector((state) => state.examPapers);

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('all');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState({});
    const [downloadingFiles, setDownloadingFiles] = useState({});

    // Subject mappings
    const artsStreamSubjects = ['History', 'Geography', 'Economics', 'Political Science', 'Psychology', 'Sociology', 'Philosophy', 'Logic', 'Art', 'Dancing', 'Music', 'Drama & Theatre', 'Oriental Music', 'Western Music', 'Bharatha Dancing', 'Home Economics', 'Agricultural Science', 'Arabic', 'Pali', 'Sanskrit', 'Hindi', 'French', 'German', 'Japanese', 'Chinese', 'Russian', 'Malay', 'Tamil', 'Buddhism', 'Christianity', 'Hinduism', 'Islam', 'Buddhist Civilization', 'Christian Civilization', 'Hindu Civilization', 'Islamic Civilization', 'Greek & Roman Civilization'];
    const commerceStreamSubjects = ['Business Studies', 'Accounting', 'Economics', 'Business Statistics', 'Geography', 'History', 'Political Science', 'Psychology', 'Sociology', 'Philosophy', 'Logic', 'Arabic', 'Pali', 'Sanskrit', 'Hindi', 'French', 'German', 'Japanese', 'Chinese', 'Russian', 'Malay', 'Tamil', 'Art', 'Dancing', 'Music', 'Drama & Theatre', 'Oriental Music', 'Western Music', 'Bharatha Dancing'];
    const scienceStreamSubjects = ['Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'Agricultural Science', 'Geography', 'History', 'Economics', 'Political Science', 'Psychology', 'Sociology', 'Philosophy', 'Logic', 'Art', 'Dancing', 'Music', 'Drama & Theatre', 'Oriental Music', 'Western Music', 'Bharatha Dancing'];
    const technologyStreamSubjects = ['Engineering Technology', 'Science for Technology', 'Bio-Resource Technology', 'Information & Communication Technology'];
    const olSubjects = ['Mathematics', 'Science', 'English', 'Sinhala', 'Tamil', 'History', 'Geography', 'Civics', 'Buddhism', 'Hinduism', 'Christianity', 'Islam', 'Art', 'Dancing', 'Music', 'Drama & Theatre', 'Health & Physical Education', 'Practical & Technical Skills', 'Information & Communication Technology', 'Eastern Music', 'Western Music', 'Arabic', 'Pali', 'Sanskrit', 'Hindi', 'French', 'German', 'Japanese', 'Chinese', 'Korean', 'Malay', 'Bharatha Dancing'];

    // Fetch exam papers on component mount
    useEffect(() => {
        if (typeof dispatch === 'function') {
            dispatch(fetchExamPapers());
        }
    }, [dispatch]);

    // Filter and sort exam papers
    const filteredPapers = (allExamPapers || [])
        .filter(paper => {
            const matchesSearch = paper.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                paper.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                paper.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesExamType = selectedExamType === 'all' || paper.examType === selectedExamType;
            const matchesGrade = selectedGrade === 'all' || paper.grade?.toString() === selectedGrade;
            const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;

            return matchesSearch && matchesExamType && matchesGrade && matchesSubject;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                case 'grade':
                    return (a.grade || 0) - (b.grade || 0);
                case 'subject':
                    return (a.subject || '').localeCompare(b.subject || '');
                default:
                    return 0;
            }
        });

    // Get subjects based on exam type
    const getSubjects = () => {
        if (selectedExamType === 'ol') {
            return olSubjects;
        } else if (selectedExamType === 'al') {
            return [
                ...scienceStreamSubjects,
                ...artsStreamSubjects,
                ...commerceStreamSubjects,
                ...technologyStreamSubjects
            ];
        }
        return [];
    };

    // Handle download with loading state
    const handleDownload = async (paper, fileIndex = null) => {
        const downloadKey = fileIndex !== null ? `${paper.id}-${fileIndex}` : paper.id;

        if (paper.media && paper.media.length > 0) {
            try {
                setDownloadingFiles(prev => ({ ...prev, [downloadKey]: true }));

                if (fileIndex !== null) {
                    // Download specific file
                    const file = paper.media[fileIndex];
                    const link = document.createElement('a');
                    link.href = file;
                    link.download = `${paper.subject}_Grade${paper.grade}_${paper.semester}_${new Date(paper.year).getFullYear()}_File${fileIndex + 1}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    // Download first file or all files
                    const link = document.createElement('a');
                    link.href = paper.media[0];
                    link.download = `${paper.subject}_Grade${paper.grade}_${paper.semester}_${new Date(paper.year).getFullYear()}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                // Simulate download delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                alert('Download failed. Please try again.');
            } finally {
                setDownloadingFiles(prev => ({ ...prev, [downloadKey]: false }));
            }
        } else {
            alert('No media files available for download');
        }
    };

    // Handle view paper
    const handleViewPaper = (paper) => {
        setSelectedPaper(paper);
        setShowModal(true);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get grade display text
    const getGradeDisplay = (grade) => {
        return `Grade ${grade}`;
    };

    // Get exam type badge color
    const getExamTypeBadge = (examType) => {
        const colors = {
            'ol': 'bg-blue-100 text-blue-800',
            'al': 'bg-purple-100 text-purple-800'
        };
        return colors[examType] || 'bg-gray-100 text-gray-800';
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <ExamPaperSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => dispatch && dispatch(fetchExamPapers())}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <LoadingSpinner size="small" color="white" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                            Exam Papers
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">Browse and download exam papers from various schools and grades</p>
                </div>

                {/* Enhanced Search and Filters */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Enhanced Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by subject, school, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Enhanced Sort */}
                        <div className="lg:w-56">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="grade">By Grade</option>
                                <option value="subject">By Subject</option>
                            </select>
                        </div>

                        {/* Enhanced Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 rounded-lg transition-all border border-gray-200"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Enhanced Advanced Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-gray-200"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Exam Type</label>
                                        <select
                                            value={selectedExamType}
                                            onChange={(e) => setSelectedExamType(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="ol">O/L</option>
                                            <option value="al">A/L</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Grade</label>
                                        <select
                                            value={selectedGrade}
                                            onChange={(e) => setSelectedGrade(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="all">All Grades</option>
                                            {selectedExamType === 'ol' ? (
                                                ['6', '7', '8', '9', '10', '11'].map(grade => (
                                                    <option key={grade} value={grade}>Grade {grade}</option>
                                                ))
                                            ) : (
                                                ['12', '13'].map(grade => (
                                                    <option key={grade} value={grade}>Grade {grade}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Subject</label>
                                        <select
                                            value={selectedSubject}
                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="all">All Subjects</option>
                                            {getSubjects().map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600 font-medium">
                        Showing <span className="font-bold text-blue-600">{filteredPapers.length}</span> of <span className="font-bold">{(allExamPapers || []).length}</span> exam papers
                    </p>
                </div>

                {/* Enhanced Exam Papers List - One per row */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredPapers.map((paper, index) => (
                            <motion.div
                                key={paper.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-6">
                                        {/* Subject Icon */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <FileText className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Paper Details */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title and Badge */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{paper.subject}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-600 font-medium">{getGradeDisplay(paper.grade)}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExamTypeBadge(paper.examType)}`}>
                                                            {paper.examType?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Paper Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <School className="w-4 h-4" />
                                                    <span>{paper.school}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(paper.year)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{paper.semester}</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {paper.description && (
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {paper.description}
                                                </p>
                                            )}

                                            {/* Media Files */}
                                            {paper.media && paper.media.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {paper.media.length} file{paper.media.length > 1 ? 's' : ''} available
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {paper.media.slice(0, 3).map((file, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                                                            >
                                                                File {index + 1}
                                                            </span>
                                                        ))}
                                                        {paper.media.length > 3 && (
                                                            <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                                                                +{paper.media.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewPaper(paper)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-sm font-medium"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(paper)}
                                                    disabled={!paper.media || paper.media.length === 0}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-md transition-colors text-sm font-medium"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredPapers.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No exam papers found</h3>
                        <p className="text-gray-500">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>

            {/* View Paper Modal */}
            <AnimatePresence>
                {showModal && selectedPaper && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selectedPaper.subject}</h2>
                                        <p className="text-gray-600">{getGradeDisplay(selectedPaper.grade)} • {selectedPaper.school}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Enhanced Modal Content */}
                            <div className="p-8">
                                {/* Paper Details Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    {/* Left Column - Paper Information */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                Paper Information
                                            </h3>
                                            <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                                                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-blue-500" />
                                                        <span className="text-gray-600 font-medium">Subject:</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{selectedPaper.subject}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-green-500" />
                                                        <span className="text-gray-600 font-medium">Grade:</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{getGradeDisplay(selectedPaper.grade)}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-center gap-2">
                                                        <School className="w-4 h-4 text-purple-500" />
                                                        <span className="text-gray-600 font-medium">School:</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{selectedPaper.school}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-orange-500" />
                                                        <span className="text-gray-600 font-medium">Semester:</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{selectedPaper.semester}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-red-500" />
                                                        <span className="text-gray-600 font-medium">Year:</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{formatDate(selectedPaper.year)}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-indigo-500" />
                                                        <span className="text-gray-600 font-medium">Exam Type:</span>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExamTypeBadge(selectedPaper.examType)}`}>
                                                        {selectedPaper.examType?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Description */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Description
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-6">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {selectedPaper.description || 'No description available for this exam paper. This paper contains standard examination questions following the curriculum guidelines.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                Additional Info
                                            </h3>
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-gray-700">Average Rating: <strong>4.8/5</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Download className="w-4 h-4 text-green-500" />
                                                    <span className="text-gray-700">Downloads: <strong>1,247</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    <span className="text-gray-700">Added: <strong>{formatDate(selectedPaper.created_at)}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Media Files Section */}
                                {selectedPaper.media && selectedPaper.media.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            Available Files ({selectedPaper.media.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedPaper.media.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 rounded-xl border border-gray-200 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-gray-800">File {index + 1}</span>
                                                            <p className="text-xs text-gray-500">PDF Document</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => window.open(file, '_blank')}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View file"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(selectedPaper, index)}
                                                            disabled={downloadingFiles[`${selectedPaper.id}-${index}`]}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                                        >
                                                            {downloadingFiles[`${selectedPaper.id}-${index}`] ? (
                                                                <>
                                                                    <LoadingSpinner size="small" color="white" />
                                                                    <span>Downloading...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Download className="w-4 h-4" />
                                                                    <span>Download</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => handleDownload(selectedPaper)}
                                        disabled={!selectedPaper.media || selectedPaper.media.length === 0 || downloadingFiles[selectedPaper.id]}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl transition-all font-semibold text-lg shadow-lg"
                                    >
                                        {downloadingFiles[selectedPaper.id] ? (
                                            <>
                                                <LoadingSpinner size="medium" color="white" />
                                                Downloading All Files...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-5 h-5" />
                                                Download All Files
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-all font-semibold text-lg"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamPapers;