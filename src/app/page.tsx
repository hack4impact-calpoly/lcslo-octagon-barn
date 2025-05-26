"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import EventTile from "@/components/EventTile";
import AdminEventDashboard from "@/components/AdminEventDashboard";
import { LoadingSpinner, ErrorState } from "@/components/loadingStates";

interface Event {
  id: string;
  eventName: string;
  eventDateStart: Date;
  eventDateEnd: Date;
  venue: "Full Facility" | "Octagon Barn & Plaza" | "Shed & Courtyard" | "Milking Parlor" | "Other";
  numGuests: number;
  docsCompleted: number;
  docsTotal: number;
  imageSrc: string;
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = user?.id;

  // Redirect if user is not loaded or signed out
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Fetch events when user is authenticated
  useEffect(() => {
    if (userId) {
      fetch(`/api/event/user_id/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setEvents(data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load events", err);
          setLoading(false);
          setError("Failed to load page");
        });
    }
  }, [userId]);

  // Show loading state
  if (!isLoaded || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error ? error : "An unknown error occurred"} />;
  }

  // If user is admin, render AdminEventDashboard component
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  return (
    <main className="p-6">
      {isAdmin ? (
        <AdminEventDashboard /> // Admin dashboard
      ) : (
        // Client Home Page with events
        <div className="flex flex-col items-center p-8 w-full min-h-screen bg-white">
          <h1 className="text-2xl font-bold mb-6">Your Events</h1>
          {/* Render event tiles */}
          <div className="flex flex-col gap-4 w-full max-w-5xl">
            {events.length > 0 ? (
              events.map((event) => (
                <EventTile
                  key={event.id}
                  id={event.id}
                  eventName={event.eventName}
                  eventDateStart={new Date(event.eventDateStart)}
                  eventDateEnd={new Date(event.eventDateEnd)}
                  venue={event.venue}
                  numGuests={event.numGuests}
                  docsCompleted={event.docsCompleted}
                  docsTotal={event.docsTotal}
                  imageSrc={event.imageSrc}
                  variant="list"
                />
              ))
            ) : (
              <p className="text-center text-gray-500 text-lg">No events found</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
