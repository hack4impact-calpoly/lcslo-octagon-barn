"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileInvoice, faFile, faDownload } from "@fortawesome/free-solid-svg-icons";

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
    headerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg", // Placeholder image path, replace with your actual image
  };

  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<IEventData>(initialData);
  const [editCache, setEditCache] = useState<IEventData>(initialData);

  // Disabled admin check temporarily so I can see the contents
  if (!user /* || !user.publicMetadata.isAdmin*/) {
    return <div className="p-6">You do not have permission to view this page.</div>;
  }

  const handleEditClick = () => {
    // Save the current state to editCache when entering edit mode
    setEditCache({ ...eventData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Revert to the saved state
    setEventData(editCache);
    setIsEditing(false);
  };

  const handleSave = async () => {
    console.log("Saving event data:", eventData);
    // API to save the data
    setEditCache({ ...eventData }); // Update the edit cache with saved data
    setIsEditing(false);
  };

  const removeDocument = (index: number) => {
    const updatedDocs = [...eventData.documents];
    updatedDocs.splice(index, 1);
    setEventData({ ...eventData, documents: updatedDocs });
  };

  const formsFilled = () => {
    return `${eventData.forms.completed}/${eventData.forms.total}`;
  };

  const formatDateTimeRange = () => {
    return `${eventData.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")} ${eventData.timeStart} - ${eventData.timeEnd}`;
  };

  return (
    <div className="p-4 md:p-8 lg:p-16">
      {/* Event Header Section with Background Image */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded p-4 relative mb-6 space-y-2 overflow-hidden"
        style={{
          backgroundImage: `url(${eventData.headerImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Semi-transparent overlay for better text visibility */}
        <div className="absolute inset-0 bg-gray-200 bg-opacity-70"></div>

        <div className="flex flex-col mb-4 mt-4 z-10 relative">
          <h2 className="text-2xl font-bold">{eventData.eventName}</h2>
          <p className="text-md">{formatDateTimeRange()}</p>
          <p className="text-md">{eventData.location}</p>
        </div>

        {/* Attendee data - pulled further from the right edge */}
        <div className="flex flex-col justify-end items-start sm:items-center sm:pr-8 md:pr-16 lg:pr-32 text-md z-10 relative">
          <div className="flex items-center">
            <span className="mr-3">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <span>{eventData.attendees}</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="mr-3">
              <FontAwesomeIcon icon={faFileInvoice} />
            </span>
            <span>{formsFilled()}</span>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div>
        <Tabs defaultValue="details">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-0">
            <TabsList className="mb-0">
              <TabsTrigger
                value="details"
                className="text-md data-[state=active]:bg-gray-200 data-[state=active]:text-black data-[state=active]:underline data-[state=inactive]:bg-gray-100 data-[state=active]:rounded-b-none"
              >
                Event Details
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="text-md data-[state=active]:bg-gray-200 data-[state=active]:text-black data-[state=active]:underline data-[state=inactive]:bg-gray-100 data-[state=active]:rounded-b-none"
              >
                Documents
              </TabsTrigger>
            </TabsList>

            <div className="space-x-2">
              {!isEditing && (
                <Button className="w-24 bg-gray-100 hover:bg-gray-200" variant="outline" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
              <Button className="w-24 bg-gray-100 hover:bg-gray-200" variant="outline">
                Upload
              </Button>
            </div>
          </div>

          {/* Event Details tab */}
          <TabsContent value="details" className="mt-0 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4 bg-gray-200 p-4 rounded">
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
                  <label htmlFor="vendorList" className="block text-md font-medium mb-2">
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
              <div className="space-y-4 bg-gray-200 p-4 rounded">
                {isEditing ? (
                  <ul className="space-y-4">
                    <li>
                      <label htmlFor="adminName" className="block text-md font-medium mb-2">
                        Admin Name
                      </label>
                      <Input
                        id="adminName"
                        value={eventData.adminName || ""}
                        onChange={(e) => setEventData({ ...eventData, adminName: e.target.value })}
                      />
                    </li>
                    <li>
                      <label htmlFor="email" className="block text-md font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={eventData.email || ""}
                        onChange={(e) => setEventData({ ...eventData, email: e.target.value })}
                      />
                    </li>
                    <li>
                      <label htmlFor="phone" className="block text-md font-medium mb-2">
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
                    <li>{eventData.adminName}</li>
                    <li>{eventData.email}</li>
                    <li>{eventData.phone}</li>
                  </ul>
                )}

                {/* Document list */}
                <div className="space-y-3">
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
                          onClick={() => removeDocument(index)}
                          className="bg-gray-300 hover:bg-gray-400 p-1 rounded mr-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Save and Cancel buttons appear only if editing */}
                {isEditing && (
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button className="w-24 bg-gray-300 hover:bg-gray-400" variant="outline" onClick={handleSave}>
                      Save
                    </Button>
                    <Button className="w-24 bg-gray-300 hover:bg-gray-400" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents tab */}
          <TabsContent value="documents" className="mt-0 pt-4">
            <div className="p-4 bg-gray-200 rounded">{/* empty for now */}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
