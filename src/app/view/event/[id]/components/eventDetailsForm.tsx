import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateForInput, formatTimeForInput, updateDatePart, updateTimePart } from "./dateUtils";

interface IEventFrontend {
  venue: "Full Facility" | "Octagon Barn & Plaza" | "Shed & Courtyard" | "Milking Parlor" | "Other";
  eventName: string;
  eventDateStart: Date;
  eventDateEnd: Date;
  numGuests: number;
  eventDetails: string;
  vendorList: string;
  headerImageUrl?: string;
}

interface EventDetailsFormProps {
  eventData: IEventFrontend;
  onUpdateField: (field: string, value: any) => void;
  venueOptions: IEventFrontend["venue"][];
}

export default function EventDetailsForm({ eventData, onUpdateField, venueOptions }: EventDetailsFormProps) {
  return (
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
            onChange={(e) => onUpdateField("eventName", e.target.value)}
          />
        </div>
        {/* Venue */}
        <div>
          <label htmlFor="venue" className="block text-sm font-medium mb-1">
            Venue
          </label>
          <Select
            value={eventData.venue}
            onValueChange={(value) => onUpdateField("venue", value as IEventFrontend["venue"])}
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
            onChange={(e) => onUpdateField("eventDateStart", updateDatePart(eventData.eventDateStart, e.target.value))}
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
            onChange={(e) => onUpdateField("eventDateEnd", updateDatePart(eventData.eventDateEnd, e.target.value))}
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
            onChange={(e) => onUpdateField("eventDateStart", updateTimePart(eventData.eventDateStart, e.target.value))}
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
            onChange={(e) => onUpdateField("eventDateEnd", updateTimePart(eventData.eventDateEnd, e.target.value))}
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
            onChange={(e) => onUpdateField("numGuests", parseInt(e.target.value, 10) || 0)}
          />
        </div>
        {/* Header Image URL */}
        <div>
          <label htmlFor="headerImageUrl" className="block text-sm font-medium mb-1">
            Header Image URL
          </label>
          <Input
            id="headerImageUrl"
            value={eventData.headerImageUrl || ""}
            onChange={(e) => onUpdateField("headerImageUrl", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
