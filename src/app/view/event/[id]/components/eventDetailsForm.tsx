import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDateForInput, formatTimeForInput, updateDatePart, updateTimePart } from "./dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";

interface IGeneralResource {
  name: string;
  url: string;
}

interface IEventFrontend {
  venue: "Full Facility" | "Octagon Barn & Plaza" | "Shed & Courtyard" | "Milking Parlor" | "Other";
  eventName: string;
  eventDateStart: Date;
  eventDateEnd: Date;
  numGuests: number;
  eventDetails: string;
  vendorList: string;
  headerImageUrl?: string;
  generalResources?: IGeneralResource[];
}

interface EventDetailsFormProps {
  eventData: IEventFrontend;
  onUpdateField: (field: string, value: any) => void;
  venueOptions: IEventFrontend["venue"][];
  onRemoveGeneralResource?: (index: number) => void;
}

export default function EventDetailsForm({
  eventData,
  onUpdateField,
  venueOptions,
  onRemoveGeneralResource,
}: EventDetailsFormProps) {
  const generalResources = eventData.generalResources || [];

  return (
    <div className="w-3/4 space-y-6">
      {/* Main Event Details Form */}
      <div className="p-4 space-y-4 bg-gray-200 rounded-lg shadow-md border border-gray-300">
        <h3 className="text-xl font-semibold mb-4 text-center">Edit Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className="block text-base font-medium mb-1">
              Event Name
            </label>
            <Input
              id="eventName"
              value={eventData.eventName}
              onChange={(e) => onUpdateField("eventName", e.target.value)}
              className="md:text-base"
            />
          </div>
          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-base font-medium mb-1">
              Venue
            </label>
            <Select
              value={eventData.venue}
              onValueChange={(value) => onUpdateField("venue", value as IEventFrontend["venue"])}
            >
              <SelectTrigger id="venue" className="text-base">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venueOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-base">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Start Date */}
          <div>
            <label htmlFor="eventDateStart" className="block text-base font-medium mb-1">
              Start Date
            </label>
            <Input
              id="eventDateStart"
              type="date"
              value={formatDateForInput(eventData.eventDateStart)}
              onChange={(e) =>
                onUpdateField("eventDateStart", updateDatePart(eventData.eventDateStart, e.target.value))
              }
              className="md:text-base"
            />
          </div>
          {/* End Date */}
          <div>
            <label htmlFor="eventDateEnd" className="block text-base font-medium mb-1">
              End Date
            </label>
            <Input
              id="eventDateEnd"
              type="date"
              value={formatDateForInput(eventData.eventDateEnd)}
              onChange={(e) => onUpdateField("eventDateEnd", updateDatePart(eventData.eventDateEnd, e.target.value))}
              className="md:text-base"
            />
          </div>
          {/* Start Time */}
          <div>
            <label htmlFor="eventStartTime" className="block text-base font-medium mb-1">
              Start Time
            </label>
            <Input
              id="eventStartTime"
              type="time"
              value={formatTimeForInput(eventData.eventDateStart)}
              onChange={(e) =>
                onUpdateField("eventDateStart", updateTimePart(eventData.eventDateStart, e.target.value))
              }
              className="md:text-base"
            />
          </div>
          {/* End Time */}
          <div>
            <label htmlFor="eventEndTime" className="block text-base font-medium mb-1">
              End Time
            </label>
            <Input
              id="eventEndTime"
              type="time"
              value={formatTimeForInput(eventData.eventDateEnd)}
              onChange={(e) => onUpdateField("eventDateEnd", updateTimePart(eventData.eventDateEnd, e.target.value))}
              className="md:text-base"
            />
          </div>
          {/* Number of Guests */}
          <div>
            <label htmlFor="numGuests" className="block text-base font-medium mb-1">
              Number of Guests
            </label>
            <Input
              id="numGuests"
              type="number"
              value={eventData.numGuests}
              onChange={(e) => onUpdateField("numGuests", parseInt(e.target.value, 10))}
              className="md:text-base"
            />
          </div>
          {/* Header Image URL */}
          <div>
            <label htmlFor="headerImageUrl" className="block text-base font-medium mb-1">
              Header Image URL
            </label>
            <Input
              id="headerImageUrl"
              value={eventData.headerImageUrl || ""}
              onChange={(e) => onUpdateField("headerImageUrl", e.target.value)}
              className="md:text-base"
            />
          </div>
        </div>
      </div>

      {/* General Resources Management Section */}
      <div className="p-4 space-y-4 bg-gray-200 rounded-lg shadow-md border border-gray-300">
        <h3 className="text-xl font-semibold mb-4 text-center">Manage General Resources</h3>
        <div className="space-y-3">
          {generalResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFile} className="mr-3 text-gray-600" />
                <span className="text-base font-medium">{resource.name}</span>
              </div>
              {onRemoveGeneralResource && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveGeneralResource(index)}
                  className="text-white"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {generalResources.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No general resources available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
