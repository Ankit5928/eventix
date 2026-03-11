import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { makeReservation } from '../../store/slices/publicSlice'; // Example thunk name
import EventCard from '../../components/commons/EventCard';
import Pagination from '../../components/commons/Pagination';
import { useNavigate } from 'react-router-dom';

const EventListingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, isLoading } = useAppSelector((state) => state.public);

  // Note: Add a fetch thunk to publicSlice if not already there
  useEffect(() => {
    // dispatch(fetchPublicEvents({ page: 0, size: 12 }));
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Discover Events</h1>
        <p className="text-gray-600 mt-2">Find and book the best experiences near you.</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
           {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onView={(id) => navigate(`/event/${id}`)} 
            />
          ))}
        </div>
      )}

      <div className="mt-12">
        <Pagination currentPage={0} totalPages={5} onPageChange={(p) => console.log(p)} />
      </div>
    </div>
  );
};

export default EventListingPage;