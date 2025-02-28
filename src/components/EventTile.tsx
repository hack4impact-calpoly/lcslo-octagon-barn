"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, FileText, MapPin, User } from "lucide-react";

interface EventTileProps {
  id: string;
  eventName: string;
  eventDate: Date;
  venue: string;
  attendees: number;
  documentsCompleted: number;
  totalDocuments: number;
  imageSrc: string;
  variant?: "list" | "detail"; // "list" for the List View page, "detail" for the Event Details page
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
  variant = "list", // Default to "list" variant
}) => {
  const router = useRouter();

  // Format the event date (e.g., "2025-02-28") and time (e.g., "11:00")
  const eventFormattedDate = eventDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const eventFormattedTime = eventDate.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });

  // Combine date and time for display.
  // This may need to be updated to handle event end times in the future. (Ex: `${eventFormattedDate} ${eventFormattedTime} - ${eventFormattedEndTime}`
  const formattedDate = `${eventFormattedDate} ${eventFormattedTime}`;

  // Conditional style based on the variant: list view vs. event details
  const containerClasses =
    variant === "list"
      ? "relative flex items-center rounded-lg overflow-hidden shadow-md cursor-pointer border border-gray-300 hover:shadow-lg transition w-2/3 m-2"
      : "relative flex items-center rounded-lg overflow-hidden shadow-md transition w-3/4 m-2"; // Banner on top of the Event details page (can modify style later when implementing the Event Details page)

  // Navigation click handler for the list view
  const handleClick = variant === "list" ? () => router.push(`/event/${id}`) : undefined;

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      aria-label={variant === "list" ? `View details for ${eventName} on ${formattedDate}` : undefined}
    >
      {/* Background Image */}
      <Image
        src={imageSrc || "/octagon_barn_plaza.jpg"} // Default image if none provided; imageSrc should be a photo of the venue
        alt={eventName}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 p-6 text-white w-full flex flex-col lg:flex-row justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold px-1 py-1">{eventName}</h3>
          <div className="flex flex-col items-start gap-1 px-1 py-1">
            <p className="text-lg flex items-center gap-2">
              <Calendar size={18} /> {formattedDate}
            </p>
            <p className="text-lg flex items-center gap-2">
              <MapPin size={18} /> {venue || "Not Available"}
            </p>
          </div>
        </div>

        {/* Event Stats */}
        <div className="flex flex-col items-start gap-1 p-1">
          <p className="text-lg flex items-center gap-2">
            <User size={18} /> {attendees || "N/A"}{" "}
            {/* Check with client if they want to add attendees to the eventSchema */}
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
