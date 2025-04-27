"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, FileText, MapPin, User } from "lucide-react";

interface EventTileProps {
  id: string;
  eventName: string;
  eventDateStart: Date;
  eventDateEnd: Date;
  venue: "Full Facility" | "Octagon Barn & Plaza" | "Shed & Courtyard" | "Milking Parlor" | "Other";
  numGuests: number;
  docsCompleted: number;
  docsTotal: number;
  imageSrc: string;
  variant?: "list" | "detail"; // "list" for the List View page, "detail" for the Event Details page
}

const EventTile: React.FC<EventTileProps> = ({
  id,
  eventName,
  eventDateStart,
  eventDateEnd,
  venue,
  numGuests,
  docsCompleted,
  docsTotal,
  imageSrc,
  variant = "list", // Default to "list" variant
}) => {
  const router = useRouter();

  // Format the event date (e.g., "2025-02-28") and time (e.g., "11:00")
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
  const formatTime = (date: Date) => date.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });

  // Combine date and time for display.
  const formattedDateRange = `${formatDate(eventDateStart)} ${formatTime(eventDateStart)} - ${formatTime(eventDateEnd)}`;

  // Logic for determining the image source based on the venue or user-provided image
  const getImageSrc = () => {
    if (imageSrc) {
      return imageSrc; // User-provided image
    }
    switch (venue) {
      case "Octagon Barn & Plaza":
        return "/octagon_barn_plaza.jpg";
      case "Shed & Courtyard":
        return "/courtyard_shed.jpg";
      case "Milking Parlor":
        return "/milking_parlor.jpg";
      default:
        return "/octagon_barn_plaza.jpg"; // Default if no image and venue are provided
    }
  };

  // Conditional style based on the variant: list view vs. event details
  const containerClasses =
    variant === "list"
      ? "relative flex items-center rounded-lg overflow-hidden shadow-md cursor-pointer border border-gray-300 hover:shadow-lg transition w-5/6 max-w-4xl mx-auto m-2"
      : "relative flex items-center rounded-lg overflow-hidden shadow-md transition w-3/4 m-2"; // Banner on top of the Event details page (can modify style later when implementing the Event Details page)

  // Navigation click handler for the list view
  const handleClick = variant === "list" ? () => router.push(`/event/${id}`) : undefined;

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      aria-label={variant === "list" ? `View details for ${eventName} on ${formattedDateRange}` : undefined}
    >
      {/* Background Image */}
      <Image
        src={getImageSrc()} // Dynamically selected image
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
              <Calendar size={18} /> {formattedDateRange}
            </p>
            <p className="text-lg flex items-center gap-2">
              <MapPin size={18} /> {venue || "Not Available"}
            </p>
          </div>
        </div>

        {/* Event Stats */}
        <div className="flex flex-col items-start gap-1 p-1">
          <p className="text-lg flex items-center gap-2">
            <User size={18} /> {numGuests || "N/A"}
          </p>
          <p className="text-lg flex items-center gap-2">
            <FileText size={18} /> {docsCompleted}/{docsTotal}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventTile;
