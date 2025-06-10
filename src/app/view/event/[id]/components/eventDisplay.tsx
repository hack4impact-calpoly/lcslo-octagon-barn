import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IEventFrontend, ITempEventData } from "./event";

interface EventDisplayProps {
  eventData: (IEventFrontend & ITempEventData) | null;
  eventDetails: string;
  vendorList: string;
  isEditing: boolean;
  isAdmin: boolean;
  editCache: (IEventFrontend & ITempEventData) | null;
  onUpdateField: (field: string, value: string) => void;
  onSave: () => void;
  setEventData: React.Dispatch<React.SetStateAction<(IEventFrontend & ITempEventData) | null>>;
  setEditCache: React.Dispatch<React.SetStateAction<(IEventFrontend & ITempEventData) | null>>;
}

export default function EventDisplay({
  eventData,
  eventDetails,
  vendorList,
  editCache,
  isEditing,
  isAdmin,
  onUpdateField,
  onSave,
  setEventData,
  setEditCache,
}: EventDisplayProps) {
  const [isClientEditing, setIsClientEditing] = useState(false);
  return (
    <div className="space-y-4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300">
      <div>
        <label htmlFor="eventDetailsDisplay" className="block text-lg font-medium mb-1">
          Event Details:
        </label>
        {isEditing && isAdmin ? (
          <Textarea
            id="eventDetailsEdit"
            value={eventDetails}
            onChange={(e) => onUpdateField("eventDetails", e.target.value)}
            rows={4}
            className="resize-none md:text-base"
          />
        ) : (
          <p id="eventDetailsDisplay" className="text-base whitespace-pre-line">
            {eventDetails}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="vendorListDisplay" className="block text-lg font-medium mb-1">
          Vendor List:
        </label>
        {isAdmin ? (
          isEditing ? (
            <Textarea
              id="vendorListEdit"
              value={vendorList}
              onChange={(e) => onUpdateField("vendorList", e.target.value)}
              rows={4}
              className="resize-none md:text-base"
            />
          ) : (
            <p id="vendorListDisplay" className="text-base whitespace-pre-line">
              {vendorList}
            </p>
          )
        ) : (
          <div className="w-full max-w-2xl mx-auto mb-2">
            {isClientEditing ? (
              <>
                <textarea
                  value={vendorList}
                  onChange={(e) => onUpdateField("vendorList", e.target.value)}
                  className="w-full p-3 border rounded-md"
                  rows={5}
                />
                <div className="mt-2 space-x-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await onSave(); // Save and then hide edit
                      setIsClientEditing(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEventData(editCache); // Revert
                      setIsClientEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="whitespace-pre-wrap border p-2 rounded-md bg-gray-50">{vendorList}</p>
                <Button
                  className="mt-2"
                  variant="outline"
                  onClick={() => {
                    setEditCache(eventData);
                    setIsClientEditing(true);
                  }}
                >
                  Edit Vendor List
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
