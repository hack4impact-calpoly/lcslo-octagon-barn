"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDownload } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { useParams } from "next/navigation";
import EventTile from "@/components/EventTile";

// Temporary Interface because event schema does not match
interface IEventData {
  eventName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  clientName?: string;
  adminName?: string;
  email: string;
  phone: string;
  description: string;
  vendorList: string;
  documents: IDocument[];
  attendees: number;
  forms: {
    completed: number;
    total: number;
  };
  headerImageUrl?: string;
}

// another temporary interface
interface IDocument {
  name: string;
  url: string;
}

export default function AdminEventView() {
  // Sample data matching the image
  const initialData: IEventData = {
    eventName: "Event Name",
    date: "2025-03-13",
    timeStart: "08:00",
    timeEnd: "14:30",
    location: "San Luis Obispo",
    clientName: "Client Name",
    adminName: "Admin Name",
    email: "contact@email.com",
    phone: "(805)-123-4567",
    description: "description placeholder",
    vendorList:
      "The following is a temporary placeholder for what eventually will be filled in with text that will contain information about the venue and its features",
    documents: [{ name: "brochure.pdf", url: "/brochure.pdf" }],
    attendees: 16,
    forms: {
      total: 8,
      completed: 2,
    },
    headerImageUrl: "/octagon_barn_plaza.jpg",
  };

  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<IEventData>(initialData);
  const [editCache, setEditCache] = useState<IEventData>(initialData);
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "default-id"); // probably update this to just do 404 not found or something gonna asks
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    if (user && user.publicMetadata.isAdmin) {
      setAuthorized(true);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
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
  };

  const removeDocument = async () => {
    console.log("Uploading to be implemented and idk how to simulate this");
  };

  return (
    <div className="p-4 md:p-8 lg:p-16">
      {/* START: Tab Selectors and Buttons Container */}
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
        </div>
      </div>

      {/* Event Tile Section */}
      <div className="flex justify-center mb-6">
        {isEditing ? (
          // Edit Event Tile Data
          <div className="w-3/4 p-4 space-y-4 bg-gray-200 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="timeStart" className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <Input
                    id="timeStart"
                    type="time"
                    value={eventData.timeStart}
                    onChange={(e) => setEventData({ ...eventData, timeStart: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="timeEnd" className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <Input
                    id="timeEnd"
                    type="time"
                    value={eventData.timeEnd}
                    onChange={(e) => setEventData({ ...eventData, timeEnd: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="attendees" className="block text-sm font-medium mb-1">
                  Attendees
                </label>
                <Input
                  id="attendees"
                  type="number"
                  value={eventData.attendees}
                  onChange={(e) => setEventData({ ...eventData, attendees: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
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
          <EventTile
            id={eventId}
            eventName={eventData.eventName}
            eventDate={new Date(`${eventData.date}T${eventData.timeStart}`)}
            venue={eventData.location}
            attendees={eventData.attendees}
            documentsCompleted={eventData.forms.completed}
            totalDocuments={eventData.forms.total}
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
                {isEditing ? (
                  <Textarea
                    id="eventDescription"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-sm">{eventData.description}</p>
                )}

                <div>
                  <label htmlFor="vendorList" className="block text-sm font-medium mb-1">
                    Vendor List:
                  </label>
                  {isEditing ? (
                    <Textarea
                      id="vendorList"
                      value={eventData.vendorList}
                      onChange={(e) => setEventData({ ...eventData, vendorList: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <p className="text-sm">{eventData.vendorList}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300">
                {isEditing ? (
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
                    <li>{eventData.adminName || "N/A"}</li>
                    <li>{eventData.email}</li>
                    <li>{eventData.phone}</li>
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
                      {isEditing && (
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
              {/* Added styling */}
              <p>Not implemented</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
