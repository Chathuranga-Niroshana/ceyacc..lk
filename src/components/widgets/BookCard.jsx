/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    BookOpen,
    ArrowLeft,
    Download,
    Bookmark,
    BookmarkCheck,
    Maximize,
    Minimize,
    ThumbsUp,
    Share,
    MessageCircle,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const BookCard = ({ book, onRatingChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [notes, setNotes] = useState('');
    const [bookProgress, setBookProgress] = useState(0);
    const iframeRef = useRef(null);
    const cardRef = useRef(null);

    // Check if the book is saved on component mount
    useEffect(() => {
        const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
        setIsSaved(savedBooks.some(savedBook => savedBook.id === book.id));

        // Get saved user rating if exists
        const savedRatings = JSON.parse(localStorage.getItem('bookRatings') || '{}');
        if (savedRatings[book.id]) {
            setUserRating(savedRatings[book.id].rating);
            setNotes(savedRatings[book.id].notes || '');
        }

        // Get reading progress
        const progress = localStorage.getItem(`progress-${book.id}`) || 0;
        setBookProgress(parseInt(progress));
    }, [book.id]);

    // Handle click outside to close expanded card
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isExpanded && cardRef.current && !cardRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (isPdfOpen) setIsPdfOpen(false);
    };

    const togglePdf = () => {
        setIsPdfOpen(!isPdfOpen);
        if (isPdfOpen) {
            setIsFullScreen(false);
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const toggleSave = (e) => {
        e.stopPropagation();
        const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');

        if (isSaved) {
            // Remove the book from saved books
            const filteredBooks = savedBooks.filter(savedBook => savedBook.id !== book.id);
            localStorage.setItem('savedBooks', JSON.stringify(filteredBooks));
        } else {
            // Add the book to saved books
            savedBooks.push(book);
            localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
        }

        setIsSaved(!isSaved);
    };

    const submitRating = () => {
        // Save rating to localStorage
        const savedRatings = JSON.parse(localStorage.getItem('bookRatings') || '{}');
        savedRatings[book.id] = {
            rating: userRating,
            notes: notes,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('bookRatings', JSON.stringify(savedRatings));

        // Call parent handler if provided
        if (onRatingChange) {
            onRatingChange(book.id, userRating, notes);
        }

        setShowRatingModal(false);
    };

    const trackReadingProgress = () => {
        // This would ideally track actual page progress in PDF
        // For demo purposes, we'll just increment by 10%
        const newProgress = Math.min(100, bookProgress + 10);
        setBookProgress(newProgress);
        localStorage.setItem(`progress-${book.id}`, newProgress.toString());
    };

    // Generate star rating display
    const renderStars = (rating, interactive = false) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (interactive) {
                stars.push(
                    <Star
                        key={`star-${i}`}
                        size={24}
                        fill={i <= (hoverRating || userRating) ? "#facc15" : "none"}
                        color={i <= (hoverRating || userRating) ? "#facc15" : "#d1d5db"}
                        className="cursor-pointer transition-all hover:scale-110"
                        onMouseEnter={() => setHoverRating(i)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(i)}
                    />
                );
            } else {
                // Non-interactive stars for display
                const starFill = i <= Math.floor(rating) ? "#facc15" :
                    (i - rating <= 0.5 && i - Math.floor(rating) > 0) ? "url(#halfStar)" : "none";

                stars.push(
                    <Star
                        key={`display-star-${i}`}
                        size={16}
                        fill={starFill}
                        color="#facc15"
                    />
                );
            }
        }

        return stars;
    };

    // PDF Viewer Component
    if (isPdfOpen) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`bg-white rounded-lg shadow-xl overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : 'w-full h-screen max-h-screen'
                        }`}
                >
                    <div className="bg-blue-700 p-3 flex items-center justify-between sticky top-0 z-10">
                        <button
                            onClick={togglePdf}
                            className="flex items-center text-white hover:text-blue-200 transition-colors"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </button>

                        <h3 className="text-white font-medium text-lg truncate max-w-xs md:max-w-md">
                            {book.title}
                        </h3>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowRatingModal(true)}
                                className="flex items-center text-white hover:text-blue-200 transition-colors"
                                title="Rate this book"
                            >
                                <ThumbsUp size={20} className={userRating > 0 ? "text-yellow-300" : ""} />
                            </button>

                            <button
                                onClick={toggleSave}
                                className="flex items-center text-white hover:text-blue-200 transition-colors"
                                title={isSaved ? "Remove from saved books" : "Save book for later"}
                            >
                                {isSaved ? (
                                    <BookmarkCheck size={20} className="text-yellow-300" />
                                ) : (
                                    <Bookmark size={20} />
                                )}
                            </button>

                            <button
                                onClick={toggleFullScreen}
                                className="flex items-center text-white hover:text-blue-200 transition-colors"
                                title={isFullScreen ? "Exit full screen" : "Full screen"}
                            >
                                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                            </button>

                            <a
                                href={book.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center text-white hover:text-blue-200 transition-colors"
                                title="Download PDF"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Reading progress bar */}
                    <div className="w-full bg-gray-200 h-1">
                        <div
                            className="bg-blue-600 h-1 transition-all"
                            style={{ width: `${bookProgress}%` }}
                        ></div>
                    </div>

                    <div className="w-full h-full relative">
                        <iframe
                            ref={iframeRef}
                            src={book.link}
                            title={book.title}
                            className="w-full border-none"
                            style={{
                                height: isFullScreen ? 'calc(100vh - 56px)' : 'calc(100vh - 56px)',
                            }}
                            onLoad={trackReadingProgress}
                        />

                        {/* PDF Navigation controls (simplified) */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Rating Modal */}
                    <AnimatePresence>
                        {showRatingModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                                onClick={() => setShowRatingModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Rate this book</h3>
                                        <button onClick={() => setShowRatingModal(false)}>
                                            <X size={20} className="text-gray-500 hover:text-gray-700" />
                                        </button>
                                    </div>

                                    <div className="flex justify-center space-x-1 mb-6">
                                        {renderStars(userRating, true)}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes (optional)
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                            placeholder="Write your thoughts about this book..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            style={{ padding: '0.5rem 1rem' }}
                                            onClick={submitRating}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                        >
                                            Submit Rating
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Book Card Component
    return (
        <motion.div
            ref={cardRef}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${isExpanded
                ? 'fixed inset-0 z-40 flex md:static md:z-auto md:inset-auto md:flex w-full md:h-auto'
                : 'w-full  h-auto mb-6'
                }`}
        >
            {/* Overlay for mobile expanded view */}
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleExpand}></div>
            )}

            <motion.div
                layout
                className={`flex ${isExpanded ? 'flex-col md:flex-row' : 'flex-col'} relative w-full h-full ${isExpanded ? 'md:h-auto bg-white z-40 rounded-lg overflow-hidden' : ''
                    }`}
            >
                {/* Close button for expanded view */}
                {isExpanded && (
                    <button
                        onClick={toggleExpand}
                        className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow-md md:hidden"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                )}

                {/* Save button */}
                <button
                    onClick={toggleSave}
                    className="absolute top-2 right-2 z-10 bg-white bg-opacity-75 hover:bg-opacity-100 p-1.5 rounded-full shadow-md transition-all"
                >
                    {isSaved ? (
                        <BookmarkCheck size={20} className="text-blue-600" />
                    ) : (
                        <Bookmark size={20} className="text-blue-600" />
                    )}
                </button>

                {/* Book Cover Image */}
                <div
                    className={`${isExpanded
                        ? 'md:w-1/3 h-64 md:h-auto md:max-h-96 cursor-default'
                        : 'w-full h-64 cursor-pointer'
                        } overflow-hidden relative`}
                    onClick={!isExpanded ? toggleExpand : undefined}
                >
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className={`w-full h-full object-cover ${!isExpanded ? 'transition-transform duration-300 hover:scale-105' : ''
                            }`}
                    />

                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {book.genre}
                    </div>

                    {bookProgress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2">
                            <div className="w-full bg-gray-200 h-1 rounded-full mt-1">
                                <div
                                    className="bg-blue-600 h-1 rounded-full"
                                    style={{ width: `${bookProgress}%` }}
                                ></div>
                            </div>
                            <div className="text-center text-xs mt-1">{bookProgress}% read</div>
                        </div>
                    )}
                </div>

                {/* Book Information */}
                <div
                    className={`p-4 ${isExpanded ? 'md:w-2/3 overflow-y-auto' : 'w-full'}`}
                    onClick={!isExpanded ? toggleExpand : undefined}
                >
                    {/* Title and Rating */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold text-gray-800 pr-8 ${isExpanded ? 'text-xl' : 'text-lg truncate'}`}>
                            {book.title}
                        </h3>
                        {userRating > 0 ? (
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                <span className="text-yellow-600 font-semibold mr-1">{userRating}</span>
                                <Star size={16} fill="#facc15" color="#facc15" />
                            </div>
                        ) : (
                            <div className="flex items-center">
                                {renderStars(book.rating)}
                                <span className="text-gray-600 text-sm ml-1">({book.rating})</span>
                            </div>
                        )}
                    </div>

                    {/* Author and Year */}
                    <p className="text-gray-600 text-sm mb-2">
                        {book.author}, {book.publicationYear}
                    </p>

                    {/* Truncated description for collapsed view */}
                    {!isExpanded && (
                        <p className="text-gray-700 text-sm line-clamp-2">
                            {book.description}
                        </p>
                    )}

                    {/* Expanded content */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4"
                        >
                            {/* Book metadata */}
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Pages</p>
                                    <p className="font-medium">{book.pages || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Publisher</p>
                                    <p className="font-medium">{book.publisher || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Language</p>
                                    <p className="font-medium">{book.language || 'English'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">ISBN</p>
                                    <p className="font-medium">{book.isbn || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Full description */}
                            <p className="text-gray-700 mb-6">{book.description}</p>

                            {/* User notes if available */}
                            {notes && (
                                <div className="mb-6 bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-1">Your Notes</h4>
                                    <p className="text-sm text-gray-700">{notes}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <div className="flex space-x-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowRatingModal(true);
                                        }}
                                        className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                                    >
                                        <ThumbsUp size={16} className="mr-1" />
                                        {userRating > 0 ? 'Edit Rating' : 'Rate'}
                                    </button>

                                    <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                                        <Share size={16} className="mr-1" />
                                        Share
                                    </button>

                                    <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                                        <MessageCircle size={16} className="mr-1" />
                                        <span className="hidden sm:inline">Reviews</span>
                                        <span className="text-xs ml-1">({book.reviews})</span>
                                    </button>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePdf();
                                    }}
                                    className="flex items-center bg-gradient-to-r from-[#90093A] to-[#FF6F91] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <BookOpen size={18} className="mr-2" />
                                    Read Now
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Rating Modal */}
                <AnimatePresence>
                    {showRatingModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowRatingModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Rate "{book.title}"</h3>
                                    <button onClick={() => setShowRatingModal(false)}>
                                        <X size={20} className="text-gray-500 hover:text-gray-700" />
                                    </button>
                                </div>

                                <div className="flex justify-center space-x-1 mb-6">
                                    {renderStars(userRating, true)}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                        placeholder="Write your thoughts about this book..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={submitRating}
                                        className="bg-gradient-to-r from-[#90093A] to-[#FF6F91] hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Submit Rating
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default BookCard;