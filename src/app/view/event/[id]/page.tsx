"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brush, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDownload } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { useParams } from "next/navigation";
import EventTile from "@/components/EventTile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// made a copy of IEvent because IEvent was a type which was giving me trouble
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

// Temporary data not present in the IEvent schema
interface ITempEventData {
  clientName?: string;
  adminName?: string;
  email: string;
  phone: string;
  documents: IDocument[];
  headerImageUrl?: string;
}

// another temp schema
interface IDocument {
  name: string;
  url: string;
}

// date formatting
const formatDateForInput = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// time formatting
const formatTimeForInput = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// just ensure the time is good
const updateDatePart = (currentDate: Date, newDateString: string): Date => {
  const timePart = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS
  const [hours, minutes, seconds] = (timePart + ":00").split(":");
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return new Date(`${newDateString}T${formattedTime}`);
};

// just ensure the time is good
const updateTimePart = (currentDate: Date, newTimeString: string): Date => {
  if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime()) || !newTimeString) {
    return currentDate;
  }
  const datePart = currentDate.toISOString().split("T")[0];
  const timeWithSeconds = newTimeString.split(":").length === 2 ? `${newTimeString}:00` : newTimeString;
  return new Date(`${datePart}T${timeWithSeconds}`);
};

export default function AdminEventView() {
  // Combined IEvent and temp data
  const initialCombinedData: IEventFrontend & ITempEventData = {
    clerkId: "placeholder-clerk-id",
    docIds: [],
    venue: "Octagon Barn & Plaza",
    eventName: "Event Name",
    eventDateStart: new Date("2025-03-13T08:00:00"),
    eventDateEnd: new Date("2025-03-13T14:30:00"),
    status: "Upcoming",
    eventDetails: "Event Details Placeholder",
    vendorList: "Vendor List Placeholder",
    createdAt: new Date(),
    docsTotal: 8,
    docsCompleted: 2,
    numGuests: 16,
    // ITempEventData fields
    clientName: "Client Name",
    adminName: "Admin Name",
    email: "contact@email.com",
    phone: "(805)-123-4567",
    documents: [{ name: "brochure.pdf", url: "/brochure.pdf" }],
    headerImageUrl: "/octagon_barn_plaza.jpg",
  };

  const { user, isLoaded } = useUser();
  const [authorized, setAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<IEventFrontend & ITempEventData>(initialCombinedData);
  const [editCache, setEditCache] = useState<IEventFrontend & ITempEventData>(initialCombinedData);
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "default-id"); // probably update this to just do 404 not found or something gonna asks
  const [activeTab, setActiveTab] = useState<string>("details");

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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotatingLines strokeColor="black" strokeWidth="4" animationDuration="0.75" width="96" visible={true} />;
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold">
        You do not have permissions to view this page
      </div>
    );
  }

  const handleEditClick = () => {
    setEditCache({ ...eventData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEventData(editCache);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setEditCache({ ...eventData });
    setIsEditing(false);
    console.log("Save clicked. Data to send:", eventData);
  };

  const removeDocument = async () => {
    console.log("Uploading to be implemented and idk how to simulate this");
  };

  return (
    <div className="p-4 md:p-8 lg:p-16">
      {/* Tab Selectors and Buttons Container */}
      <div className="w-3/4 mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-0">
          <div className="flex border-b">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("details")}
              className={`pb-1 px-4 rounded-b-none text-md border-b-2 ${activeTab === "details" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
            >
              Event Details
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("documents")}
              className={`pb-1 px-4 rounded-b-none text-md border-b-2 ${activeTab === "documents" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
            >
              Documents
            </Button>
          </div>

          {isAdmin && (
            <div className="space-x-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <Button className="w-[5rem] lg:w-[7rem]" variant="outline" onClick={handleSave}>
                    Save
                  </Button>
                  <Button className="w-[5rem] lg:w-[7rem]" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button className="w-[5rem] lg:w-[7rem]" variant="outline" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
              <Button className="w-[5rem] lg:w-[7rem]" variant="outline">
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Event Tile Section */}
      <div className="flex justify-center mb-6">
        {isEditing && isAdmin ? (
          // Edit Event Tile Data
          <div className="w-3/4 p-4 space-y-4 bg-gray-200 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Name */}
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium mb-1">
                  Event Name
                </label>
                <Input
                  id="eventName"
                  value={eventData.eventName}
                  onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}
                />
              </div>
              {/* Venue */}
              <div>
                <label htmlFor="venue" className="block text-sm font-medium mb-1">
                  Venue
                </label>
                <Select
                  value={eventData.venue}
                  onValueChange={(value) => setEventData({ ...eventData, venue: value as IEventFrontend["venue"] })}
                >
                  <SelectTrigger id="venue">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venueOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Start Date */}
              <div>
                <label htmlFor="eventDateStart" className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <Input
                  id="eventDateStart"
                  type="date"
                  value={formatDateForInput(eventData.eventDateStart)}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      eventDateStart: updateDatePart(eventData.eventDateStart, e.target.value),
                    })
                  }
                />
              </div>
              {/* End Date */}
              <div>
                <label htmlFor="eventDateEnd" className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <Input
                  id="eventDateEnd"
                  type="date"
                  value={formatDateForInput(eventData.eventDateEnd)}
                  onChange={(e) =>
                    setEventData({ ...eventData, eventDateEnd: updateDatePart(eventData.eventDateEnd, e.target.value) })
                  }
                />
              </div>
              {/* Start Time */}
              <div>
                <label htmlFor="eventStartTime" className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <Input
                  id="eventStartTime"
                  type="time"
                  value={formatTimeForInput(eventData.eventDateStart)}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      eventDateStart: updateTimePart(eventData.eventDateStart, e.target.value),
                    })
                  }
                />
              </div>
              {/* End Time */}
              <div>
                <label htmlFor="eventEndTime" className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <Input
                  id="eventEndTime"
                  type="time"
                  value={formatTimeForInput(eventData.eventDateEnd)}
                  onChange={(e) =>
                    setEventData({ ...eventData, eventDateEnd: updateTimePart(eventData.eventDateEnd, e.target.value) })
                  }
                />
              </div>
              {/* Number of Guests */}
              <div>
                <label htmlFor="numGuests" className="block text-sm font-medium mb-1">
                  Number of Guests
                </label>
                <Input
                  id="numGuests"
                  type="number"
                  value={eventData.numGuests}
                  onChange={(e) => setEventData({ ...eventData, numGuests: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
              {/* Header Image URL (from Temp Data) */}
              <div>
                <label htmlFor="headerImageUrl" className="block text-sm font-medium mb-1">
                  Header Image URL
                </label>
                <Input
                  id="headerImageUrl"
                  value={eventData.headerImageUrl || ""}
                  onChange={(e) => setEventData({ ...eventData, headerImageUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        ) : (
          // Display Event Tile using updated field names
          <EventTile
            id={eventId}
            eventName={eventData.eventName}
            eventDate={eventData.eventDateStart}
            venue={eventData.venue}
            attendees={eventData.numGuests}
            documentsCompleted={eventData.docsCompleted}
            totalDocuments={eventData.docsTotal}
            imageSrc={eventData.headerImageUrl || "/octagon_barn_plaza.jpg"}
            variant="detail"
          />
        )}
      </div>

      <div className="w-3/4 mx-auto">
        <Tabs value={activeTab} className="w-full">
          {/* Event Details tab content */}
          <TabsContent value="details" className="mt-0 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300">
                <div>
                  <label htmlFor="eventDetailsDisplay" className="block text-sm font-medium mb-1">
                    Event Details:
                  </label>
                  {isEditing && isAdmin ? (
                    <Textarea
                      id="eventDetailsEdit" // Changed id to avoid conflict
                      value={eventData.eventDetails} // Use new field name
                      onChange={(e) => setEventData({ ...eventData, eventDetails: e.target.value })} // Use new field name
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <p id="eventDetailsDisplay" className="text-sm">
                      {eventData.eventDetails}
                    </p> // Use new field name
                  )}
                </div>
                <div>
                  <label htmlFor="vendorListDisplay" className="block text-sm font-medium mb-1">
                    Vendor List:
                  </label>
                  {isEditing && isAdmin ? (
                    <Textarea
                      id="vendorListEdit" // Changed id to avoid conflict
                      value={eventData.vendorList}
                      onChange={(e) => setEventData({ ...eventData, vendorList: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <p id="vendorListDisplay" className="text-sm">
                      {eventData.vendorList}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300">
                {isEditing && isAdmin ? (
                  <ul className="space-y-4">
                    <li>
                      <label htmlFor="adminName" className="block text-sm font-medium mb-1">
                        Admin Name
                      </label>
                      <Input
                        id="adminName"
                        value={eventData.adminName || ""}
                        onChange={(e) => setEventData({ ...eventData, adminName: e.target.value })}
                      />
                    </li>
                    <li>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={eventData.email || ""}
                        onChange={(e) => setEventData({ ...eventData, email: e.target.value })}
                      />
                    </li>
                    <li>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        value={eventData.phone || ""}
                        onChange={(e) => setEventData({ ...eventData, phone: e.target.value })}
                      />
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li>Admin: {eventData.adminName || "N/A"}</li>
                    <li>Email: {eventData.email}</li>
                    <li>Phone: {eventData.phone}</li>
                  </ul>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Documents:</h4>
                  {eventData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center">
                      <FontAwesomeIcon icon={faFile} className="mr-3 text-gray-600" />
                      <a href={doc.url} className="mr-3 text-blue-500 underline">
                        {doc.name}
                      </a>
                      <a href={doc.url} download={doc.name} className="mr-4">
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="text-gray-600 cursor-pointer hover:text-gray-800"
                        />
                      </a>
                      {isEditing && isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument()}
                          className="p-1 rounded ml-auto"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {eventData.documents.length === 0 && <p className="text-sm text-gray-500">No documents uploaded.</p>}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documents tab content */}
          <TabsContent value="documents" className="mt-0 pt-4">
            <div className="p-4 bg-gray-200 rounded-lg shadow-md border border-gray-300">
              {" "}
              <p>Not implemented</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
