/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
import { GENRES } from '../../data/bookGenres';


const RATINGS = [1, 2, 3, 4, 5];

const FilterLibrary = () => {
    const [query, setQuery] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

    // Toggle genre selection
    const toggleGenre = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setQuery("");
        setSelectedGenres([]);
        setMinRating(0);
    };

    return (
        <div style={{ margin: '0px auto', padding: '32px 16px', }}>
            <div style={{ position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        borderRadius: '8px',
                        padding: '24px'
                    }}
                >
                    {/* Header with title and filter toggle button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Filter Your Books</h2>

                        <motion.button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Filter size={18} style={{ marginRight: '8px' }} />
                            Filters
                        </motion.button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Search input always visible */}
                        <div style={{ width: '100%', marginBottom: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        paddingLeft: '40px',
                                        paddingRight: '16px',
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                />
                                <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={20} />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '12px',
                                            color: '#9ca3af',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active filters display */}
                    {(selectedGenres.length > 0 || minRating > 0) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                marginTop: '16px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                            }}
                        >
                            {selectedGenres.map(genre => (
                                <motion.span
                                    key={genre}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '14px',
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af'
                                    }}
                                >
                                    {genre}
                                    <button
                                        onClick={() => toggleGenre(genre)}
                                        style={{
                                            marginLeft: '8px',
                                            color: '#2563eb',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        className="hover:text-blue-800"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.span>
                            ))}

                            {minRating > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '14px',
                                        backgroundColor: '#fef9c3',
                                        color: '#854d0e'
                                    }}
                                >
                                    {minRating}+ Stars
                                    <button
                                        onClick={() => setMinRating(0)}
                                        style={{
                                            marginLeft: '8px',
                                            color: '#ca8a04',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        className="hover:text-yellow-800"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.span>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Filter section - toggleable - moved outside to expand downward */}
                <AnimatePresence>
                    {isFiltersOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: 0 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: 0 }}
                            style={{
                                width: '100%',
                                display: 'block',
                                overflow: 'hidden',
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                zIndex: 10,
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                padding: '16px',
                                marginTop: '8px'
                            }}
                        >
                            {/* Genre filter dropdown */}
                            <div style={{
                                position: 'relative',
                                marginBottom: '16px'
                            }}>
                                <button
                                    onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        backgroundColor: 'white',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>
                                        {selectedGenres.length ? `${selectedGenres.length} Genres` : 'Select Genres'}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        style={{
                                            transition: 'transform 0.2s',
                                            transform: isGenreDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isGenreDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            style={{
                                                position: 'absolute',
                                                zIndex: 20,
                                                marginTop: '4px',
                                                width: '100%',
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                                maxHeight: '200px',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            <div style={{ padding: '8px' }}>
                                                {GENRES.map((genre) => (
                                                    <div
                                                        key={genre}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '8px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                        className="hover:bg-gray-100"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`genre-${genre}`}
                                                            checked={selectedGenres.includes(genre)}
                                                            onChange={() => toggleGenre(genre)}
                                                            style={{ marginRight: '8px' }}
                                                        />
                                                        <label
                                                            htmlFor={`genre-${genre}`}
                                                            style={{ cursor: 'pointer', width: '100%' }}
                                                        >
                                                            {genre}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Rating filter */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '4px'
                                    }}>
                                        Minimum Rating
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {RATINGS.map((rating) => (
                                            <motion.button
                                                key={rating}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    backgroundColor: rating <= minRating ? '#facc15' : '#e5e7eb',
                                                    color: rating <= minRating ? 'white' : '#4b5563',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {rating}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Clear filters button */}
                            <div style={{ marginBottom: '8px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearFilters}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        backgroundColor: '#e5e7eb',
                                        color: '#4b5563',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    className="hover:bg-gray-300"
                                >
                                    Clear Filters
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FilterLibrary;