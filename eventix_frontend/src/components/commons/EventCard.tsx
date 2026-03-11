import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { PublicEventDTO } from "../../types/public.types";
import Button from "./Button";

interface EventCardProps {
  event: PublicEventDTO;
  onView: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="h-48 w-full bg-gray-200 relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 font-bold">
            EVENTIX
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
          From ${event.minPrice}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {event.title}
        </h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {new Date(event.startDate).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <Button
          onClick={() => onView(event.id)}
          className="w-full mt-6"
          variant="primary"
        >
          Get Tickets
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
