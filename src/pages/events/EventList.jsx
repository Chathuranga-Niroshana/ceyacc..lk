import React from 'react';
import { useSelector } from 'react-redux';
import EventCard from '../../components/widgets/EventCard';

const EventList = () => {
    const { allEvents, loading, error } = useSelector((state) => state.events);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
                <p className="font-bold">Error loading events:</p>
                <p>{error}</p>
            </div>
        );
    }

    if (allEvents?.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {allEvents?.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;