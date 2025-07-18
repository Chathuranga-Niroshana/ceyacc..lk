import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { setInterest } from '../store/eventSlice';

const EventCard = ({ event }) => {
    const dispatch = useDispatch();
    // const interaction = useSelector((state) => state.events.interactions[event.id]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // const handleInterest = (isInterested) => {
    //     dispatch(setInterest({ eventId: event.id, isInterested }));
    // };

    const mediaUrls = [
        event.media_url_one,
        event.media_url_two,
        event.media_url_three,
        event.media_url_four,
        event.media_url_five,
    ].filter(url => url && url.trim() !== '');

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 max-w-2xl mx-auto">
            {/* Event Media Gallery */}
            {mediaUrls.length > 0 && (
                <div className="relative h-64 bg-gray-200">
                    <img
                        src={mediaUrls[currentImageIndex]}
                        alt={`${event.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Event+Image';
                        }}
                    />
                    {mediaUrls.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                            >
                                ←
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                            >
                                →
                            </button>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {mediaUrls.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Event Content */}
            <div className="p-6">
                {/* Event Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                    <span className="text-sm text-gray-500">#{event.id}</span>
                </div>

                {/* Event Details */}
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <span className="text-gray-600 font-medium">📅 Date: </span>
                        <span className="ml-2 text-gray-800">{formatDate(event.date_time)}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-gray-600 font-medium">📍 Location: </span>
                        <span className="ml-2 text-gray-800">{event.location}</span>
                    </div>
                    <div className="mb-4">
                        <span className="text-gray-600 font-medium">📝 Description: </span>
                        <p className="mt-1 text-gray-700 leading-relaxed">{event.description}</p>
                    </div>
                </div>

                {/* Organizer Info */}
                <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
                    <img
                        src={event.user.image || '/default-avatar.png'}
                        onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full object-cover mr-3"

                    />
                    <div>
                        <p className="font-medium text-gray-800">Organized by</p>
                        <p className="text-sm text-gray-600">{event.user.name}</p>
                    </div>
                </div>

                {/* Interest Buttons */}
                {/* <div className="flex space-x-4">
                    <button
                        onClick={() => handleInterest(true)}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${interaction === true
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                    >
                        {interaction === true ? '✓ Interested' : '👍 Interested'}
                    </button>
                    <button
                        onClick={() => handleInterest(false)}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${interaction === false
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                    >
                        {interaction === false ? '✓ Not Interested' : '👎 Not Interested'}
                    </button>
                </div> */}

                {/* Created Date */}
                <p className="text-xs text-gray-400 mt-4 text-center">
                    Created on {new Date(event.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default EventCard;