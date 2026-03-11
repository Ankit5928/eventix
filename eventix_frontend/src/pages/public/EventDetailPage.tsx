import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryCard from '../../components/commons/CategoryCard';
import Button from '../../components/commons/Button';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Fetch logic here...

  const handleReserve = async (categoryId: string) => {
    // 1. Dispatch makeReservation
    // 2. On success, navigate(`/checkout/${reservationId}`)
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-2xl overflow-hidden h-64 bg-gray-200 mb-8">
         {/* Event Image */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Event Title Here</h1>
          <p className="text-gray-600">Event Description...</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Select Tickets</h2>
          {/* Loop through categories from detail DTO */}
          <div className="p-4 border rounded-xl border-blue-100 bg-blue-50/30">
            <h4 className="font-bold">General Admission</h4>
            <p className="text-2xl font-black text-blue-600">$25.00</p>
            <Button className="w-full mt-4" onClick={() => handleReserve("uuid")}>Reserve Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;