import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventList from './EventList';
import { fetchEvents } from '../../features/events/eventSlice';

const Events = () => {
    const dispatch = useDispatch();
    // const { interactions } = useSelector((state) => state.events);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched) {
            dispatch(fetchEvents());
            setFetched(true);
        }
    }, [dispatch, fetched]);


    // const interestedCount = Object.values(interactions).filter(Boolean).length;
    // const notInterestedCount = Object.values(interactions).filter(val => val === false).length;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Events</h1>
                    <p className="text-gray-600">Discover exciting events happening around you</p>

                    {/* Interaction Summary */}
                    {/* {(interestedCount > 0 || notInterestedCount > 0) && (
                        <div className="mt-4 flex justify-center space-x-6">
                            <div className="bg-green-100 px-4 py-2 rounded-full">
                                <span className="text-green-600 font-medium">
                                    {interestedCount} Interested
                                </span>
                            </div>
                            <div className="bg-red-100 px-4 py-2 rounded-full">
                                <span className="text-red-600 font-medium">
                                    {notInterestedCount} Not Interested
                                </span>
                            </div>
                        </div>
                    )} */}
                </div>

                {/* Event List */}
                <EventList />
            </div>
        </div>
    );
};

export default Events;