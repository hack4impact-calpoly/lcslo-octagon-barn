"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import EventTile from "@/components/EventTile";
import { LoadingSpinner, UnauthorizedState, ErrorState } from "@/components/loadingStates";
import EventDetailsForm from "./components/eventDetailsForm";
import EventTabContent from "./components/eventTabContent";

interface IEventFrontend {
  clerkId: string;
  docIds: string[];
  venue: "Full Facility" | "Octagon Barn & Plaza" | "Shed & Courtyard" | "Milking Parlor" | "Other";
  eventName: string;
  eventDateStart: Date;
  eventDateEnd: Date;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  eventDetails: string;
  vendorList: string;
  createdAt: Date;
  docsTotal: number;
  docsCompleted: number;
  numGuests: number;
}

interface ITempEventData {
  clientName?: string;
  clientEmail: string;
  clientPhone: string;
  documents: IDocument[];
  headerImageUrl?: string;
}

interface IDocument {
  name: string;
  url: string;
}

export default function EventDetailsView() {
  const { user, isLoaded } = useUser();
  const [authorized, setAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<(IEventFrontend & ITempEventData) | null>(null);
  const [editCache, setEditCache] = useState<(IEventFrontend & ITempEventData) | null>(null);
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "default-id");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [eventStatus, setEventStatus] = useState<string | null>(null);
  const router = useRouter();

  const venueOptions: IEventFrontend["venue"][] = [
    "Full Facility",
    "Octagon Barn & Plaza",
    "Shed & Courtyard",
    "Milking Parlor",
    "Other",
  ];

  useEffect(() => {
    if (isLoaded && user) {
      setAuthorized(true);
      if (user.publicMetadata.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else if (isLoaded && !user) {
      setAuthorized(false);
      setIsAdmin(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (eventId && eventId !== "default-id") {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/event/${eventId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch event");
          }

          const eventData = await response.json();
          console.log("Fetched event:", eventData);
          if (!eventData.clerkId) {
            throw new Error("clerkId is missing from event");
          }

          // fetch client info using clerkId from the event
          const clientRes = await fetch(`/api/user/${eventData.clerkId}`);
          if (!clientRes.ok) {
            throw new Error("Failed to fetch client info");
          }

          const client = await clientRes.json();
          if (!client) throw new Error("Client data is undefined");

          // convert string dates to Date objects
          const formattedEvent = {
            ...eventData,
            eventDateStart: new Date(eventData.eventDateStart),
            eventDateEnd: new Date(eventData.eventDateEnd),
            createdAt: new Date(eventData.createdAt),
          };

          // combine with real client info
          const clientFirst = client.firstName ?? "";
          const clientLast = client.lastName ?? "";
          const clientName = [clientFirst, clientLast].filter(Boolean).join(" ").trim() || "Not Found";
          const combinedData = {
            ...formattedEvent,
            clientName: clientName,
            clientEmail: client.emailAddresses?.[0]?.emailAddress ?? "Not Found",
            clientPhone: client.phoneNumbers?.[0]?.phoneNumber ?? "Not Found",
            documents: [{ name: "brochure.pdf", url: "/brochure.pdf" }],
            headerImageUrl: "/octagon_barn_plaza.jpg",
          };

          setEventData(combinedData);
          setEditCache(combinedData);
          setError(null);
          setEventStatus(formattedEvent.status);
        } catch (err) {
          console.error("Error fetching event or user:", err);
          setError("Failed to load event or client data");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  if (!isLoaded || loading) {
    return <LoadingSpinner />;
  }

  if (!authorized) {
    return <UnauthorizedState />;
  }

  if (error || !eventData) {
    return <ErrorState message={error ? error : "An unknown error occurred"} />;
  }

  const handleEditClick = () => {
    setEditCache({ ...eventData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (editCache) {
      setEventData(editCache);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!eventData) return;

    try {
      const {
        clerkId,
        docIds,
        venue,
        eventName,
        eventDateStart,
        eventDateEnd,
        status,
        eventDetails,
        vendorList,
        docsTotal,
        docsCompleted,
        numGuests,
      } = eventData;

      const payload = {
        clerkId,
        docIds,
        venue,
        eventName,
        eventDateStart,
        eventDateEnd,
        status,
        eventDetails,
        vendorList,
        docsTotal,
        docsCompleted,
        numGuests,
      };

      const response = await fetch(`/api/event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();

      const formattedEvent = {
        ...updatedEvent,
        eventDateStart: new Date(updatedEvent.eventDateStart),
        eventDateEnd: new Date(updatedEvent.eventDateEnd),
        createdAt: new Date(updatedEvent.createdAt),
      };

      setEventData({
        ...formattedEvent,
        clientName: eventData.clientName,
        clientEmail: eventData.clientEmail,
        cleintPhone: eventData.clientPhone,
        documents: eventData.documents,
        headerImageUrl: eventData.headerImageUrl,
      });

      setEditCache({
        ...formattedEvent,
        clientName: eventData.clientName,
        clientEmail: eventData.clientEmail,
        clientPhone: eventData.clientPhone,
        documents: eventData.documents,
        headerImageUrl: eventData.headerImageUrl,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    if (!eventData) return;

    setEventData({
      ...eventData,
      [field]: value,
    });
  };

  const handleRemoveDocument = (index: number) => {
    if (!eventData) return;

    const updatedDocuments = [...eventData.documents];
    updatedDocuments.splice(index, 1);

    setEventData({
      ...eventData,
      documents: updatedDocuments,
    });
  };

  return (
    <div className="p-4 md:p-8 lg:p-16">
      {(eventStatus === "Completed" || eventStatus === "Cancelled") && (
        <div className="bg-yellow-100 text-black text-center py-2 rounded mb-4">{`Event is labeled ${eventStatus.toLowerCase()}`}</div>
      )}
      {/* Tab and Buttons Container */}
      <div className="w-3/4 mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-0">
          {!isEditing && (
            <div className="flex border-b">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("details")}
                className={`pb-1 px-4 rounded-b-none text-md border-b-2 text-lg ${
                  activeTab === "details"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }`}
              >
                Event Details
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("documents")}
                className={`pb-1 px-4 rounded-b-none text-md border-b-2 text-lg ${
                  activeTab === "documents"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }`}
              >
                Documents
              </Button>
            </div>
          )}

          <div className="flex-grow" />

          {isAdmin && eventStatus !== "Completed" && eventStatus !== "Cancelled" && (
            <div className="space-x-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <Button className="w-[5rem] lg:w-[7rem] text-base" variant="outline" onClick={handleSave}>
                    Save
                  </Button>
                  <Button className="w-[5rem] lg:w-[7rem] text-base" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                activeTab === "details" && (
                  <Button className="w-[5rem] lg:w-[7rem] text-base" variant="outline" onClick={handleEditClick}>
                    Edit
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-6">
        {isEditing && isAdmin ? (
          <EventDetailsForm eventData={eventData} onUpdateField={handleUpdateField} venueOptions={venueOptions} />
        ) : (
          <EventTile
            id={eventId}
            eventName={eventData.eventName}
            eventDateStart={eventData.eventDateStart}
            eventDateEnd={eventData.eventDateEnd}
            venue={eventData.venue}
            numGuests={eventData.numGuests}
            docsCompleted={eventData.docsCompleted}
            docsTotal={eventData.docsTotal}
            imageSrc={eventData.headerImageUrl || ""}
            variant="detail"
          />
        )}
      </div>

      <EventTabContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        eventDetails={eventData.eventDetails}
        vendorList={eventData.vendorList}
        documents={eventData.documents}
        name={eventData.clientName}
        email={eventData.clientEmail}
        phone={eventData.clientPhone}
        isEditing={isEditing}
        isAdmin={isAdmin}
        onUpdateField={handleUpdateField}
        onRemoveDocument={handleRemoveDocument}
      />
    </div>
  );
}
