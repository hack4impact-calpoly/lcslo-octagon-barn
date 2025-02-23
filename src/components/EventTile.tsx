"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, FileText, MapPin, User } from "lucide-react";

const formatDateTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleString("en-US", options);
};

interface EventTileProps {
  id: string;
  eventName: string;
  eventDate: Date;
  venue: string;
  attendees: number;
  documentsCompleted: number;
  totalDocuments: number;
  imageSrc: string;
}

const EventTile: React.FC<EventTileProps> = ({
  id,
  eventName,
  eventDate,
  venue,
  attendees,
  documentsCompleted,
  totalDocuments,
  imageSrc,
}) => {
  const router = useRouter();

  const formattedDate = formatDateTime(eventDate);

  return (
    <div
      className="relative flex items-center rounded-lg overflow-hidden shadow-md cursor-pointer border border-gray-300 hover:shadow-lg transition w-2/3 m-2"
      onClick={() => router.push(`/event/${id}`)}
    >
      {/* Background Image */}
      <Image
        src={imageSrc || "/octagon_barn_plaza.jpg"} // Default image if none provided
        alt={eventName}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 p-6 text-white w-full flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold px-1 py-1">{eventName}</h3>
          <div className="flex flex-col items-start gap-1 px-1 py-1">
            <p className="text-lg flex items-center gap-2">
              <Calendar size={18} /> {formattedDate}
            </p>
            <p className="text-lg flex items-center gap-2">
              <MapPin size={18} /> {venue}
            </p>
          </div>
        </div>

        {/* Event Stats */}
        <div className="flex flex-col items-start gap-1 p-1">
          <p className="text-lg flex items-center gap-2">
            <User size={18} /> {attendees}
          </p>
          <p className="text-lg flex items-center gap-2">
            <FileText size={18} /> {documentsCompleted}/{totalDocuments}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventTile;
