"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Importing the tabs components

// Define a dummy interface for event data
interface IEventData {
  eventName: string;
  // Add other properties as needed
}

const EventViewPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const [event, setEvent] = useState<IEventData | null>(null); // Use the dummy type
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<IEventData | null>(null); // Use the dummy type

  // Check if the user is an admin
  if (!user /* || !user.publicMetadata.isAdmin*/) {
    return <div>You do not have permission to view this page.</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    console.log("Saving event data:", eventData);
    // Here you would typically call an API to save the data
  };

  return (
    <div>
      <h1>Admin Event View</h1>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          {isEditing ? (
            <div>
              {/* Editable fields for event data */}
              <input
                type="text"
                value={eventData?.eventName || ""}
                onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}
                placeholder="Event Name"
              />
              {/* Add more fields as necessary */}
              <button onClick={handleSave}>Save</button>
            </div>
          ) : (
            <div>
              <h2>{event?.eventName || "No Event Name"}</h2>
              {/* Display other event details */}
              <button onClick={handleEditToggle}>Edit</button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents">
          {/* Placeholder for documents tab */}
          <div>No documents available.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventViewPage;
