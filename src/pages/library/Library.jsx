/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import libraryImg from '../../assets/images/library/libraryImg1.png';
import FilterLibrary from '../../components/widgets/FilterLibrary';
import { sampleBooks } from '../../../database/sampleBooks';
import BookCard from '../../components/widgets/BookCard';

const Library = () => {
    const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleFilterChange = (filters) => {
        setFilteredBooks(sampleBooks);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={libraryImg}
                    alt="Library"
                    className="absolute w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-black text-[#90093A] drop-shadow-lg">
                        Welcome to E~Library
                    </h1>
                </div>
            </div>

            {/* Filter section */}
            <div className="w-full z-10">
                <FilterLibrary onChange={handleFilterChange} />
            </div>

            {/* Books grid */}
            <div className="container mx-auto ">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-4 p-4">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;