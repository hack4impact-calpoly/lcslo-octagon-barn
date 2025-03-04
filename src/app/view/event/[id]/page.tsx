"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

// Temporary Interface because event schema does not match
// the info on the visual - I imagine we will import the actual
// schema for type checking and fetch the data
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
  vendorList: string;
  documents: IDocument[];
  attendees: {
    total: number;
    confirmed: number;
  };
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
    vendorList:
      "The following is a temporary placeholder for what eventually will be filled in with text that will contain information about the venue and its features",
    documents: [{ name: "brochure.pdf", url: "/brochure.pdf" }],
    attendees: {
      total: 16,
      confirmed: 2,
    },
  };

  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const [eventData, setEventData] = useState<IEventData>(initialData);

  // Disabled admin check temporarily so I can see the contents
  if (!user /* || !user.publicMetadata.isAdmin*/) {
    return <div className="p-6">You do not have permission to view this page.</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    console.log("Saving event data:", eventData);
    // API to save the data
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEventData(initialData);
    setIsEditing(false);
  };

  const removeDocument = (index: number) => {
    const updatedDocs = [...eventData.documents];
    updatedDocs.splice(index, 1);
    setEventData({ ...eventData, documents: updatedDocs });
  };

  const formatAttendeeRatio = () => {
    return `${eventData.attendees.confirmed}/${eventData.attendees.total}`;
  };

  const formatDateTimeRange = () => {
    return `${eventData.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")} ${eventData.timeStart} - ${eventData.timeEnd}`;
  };

  return (
    <div className="p-16">
      {/* Event Header Section */}
      <div className="flex justify-between items-center bg-gray-200 rounded p-4 relative mb-6">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">{eventData.eventName}</h2>
          <p className="text-sm">{formatDateTimeRange()}</p>
          <p className="text-sm">{eventData.location}</p>
        </div>

        {/* Attendee data */}
        <div className="flex flex-col justify-end items-center pr-20 text-sm">
          <div className="flex items-center justify-end">
            <span className="mr-2">{/* add icon */}</span>
            <span>{eventData.attendees.total}</span>
          </div>
          <div className="flex items-center justify-end mt-1">
            <span className="mr-2">{/* add icon */}</span>
            <span>{formatAttendeeRatio()}</span>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="border rounded-lg p-4">
        {/* These are the edit and save buttons */}
        <Tabs defaultValue="details">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {isEditing ? (
              <div className="space-x-2">
                <Button className="w-24" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button className="w-24" variant="outline" onClick={handleSave}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button className="w-24" variant="outline" onClick={handleEditToggle}>
                  Edit
                </Button>
                <Button className="w-24" variant="outline">
                  Upload
                </Button>
              </div>
            )}
          </div>

          {/* Event Details tab */}
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4 bg-gray-100 p-4 rounded">
                <p className="text-gray-600 text-sm">
                  The following is a temporary placeholder for what eventually will be filled in with text that will
                  contain information about the venue and its features
                </p>

                <div>
                  <label htmlFor="vendorList" className="block text-sm font-medium">
                    Vendor List:
                  </label>
                  {isEditing ? (
                    <Input
                      id="vendorList"
                      value={eventData.vendorList}
                      onChange={(e) => setEventData({ ...eventData, vendorList: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-600 text-sm">{eventData.vendorList}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 bg-gray-100 p-4 rounded">
                {isEditing ? (
                  <ul className="space-y-4">
                    <li>
                      <label htmlFor="adminName" className="block text-sm font-medium">
                        Admin Name
                      </label>
                      <Input
                        id="adminName"
                        value={eventData.adminName || ""}
                        onChange={(e) => setEventData({ ...eventData, adminName: e.target.value })}
                      />
                    </li>
                    <li>
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={eventData.email || ""}
                        onChange={(e) => setEventData({ ...eventData, adminName: e.target.value })}
                      />
                    </li>
                    <li>
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        value={eventData.phone || ""}
                        onChange={(e) => setEventData({ ...eventData, adminName: e.target.value })}
                      />
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li>{eventData.adminName}</li>
                    <li>{eventData.email}</li>
                    <li>{eventData.phone}</li>
                  </ul>
                )}

                {/* Document list */}
                <div>
                  {eventData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <div className="flex-1">
                        <a href={doc.url} className="flex items-center text-blue-500 hover:underline">
                          <span className="mr-2">{/* add icon */}</span>
                          {doc.name}
                        </a>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documents tab */}
          <TabsContent value="documents">
            <div className="p-4 bg-gray-100 rounded">
              {eventData.documents.length > 0 ? (
                <div className="space-y-2">
                  {eventData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center">
                      <a href={doc.url} className="flex items-center text-blue-500 hover:underline">
                        <span className="mr-2">📄</span>
                        {doc.name}
                      </a>
                      {isEditing && (
                        <Button variant="ghost" size="sm" className="ml-2" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">No documents available.</p>
                </div>
              )}

              {isEditing && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Add Document
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
