import { Textarea } from "@/components/ui/textarea";

interface EventDisplayProps {
  eventDetails: string;
  vendorList: string;
  isEditing: boolean;
  isAdmin: boolean;
  onUpdateField: (field: string, value: string) => void;
}

export default function EventDisplay({
  eventDetails,
  vendorList,
  isEditing,
  isAdmin,
  onUpdateField,
}: EventDisplayProps) {
  return (
    <div className="space-y-4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300">
      <div>
        <label htmlFor="eventDetailsDisplay" className="block text-sm font-medium mb-1">
          Event Details:
        </label>
        {isEditing && isAdmin ? (
          <Textarea
            id="eventDetailsEdit"
            value={eventDetails}
            onChange={(e) => onUpdateField("eventDetails", e.target.value)}
            rows={4}
            className="resize-none"
          />
        ) : (
          <p id="eventDetailsDisplay" className="text-sm">
            {eventDetails}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="vendorListDisplay" className="block text-sm font-medium mb-1">
          Vendor List:
        </label>
        {isEditing && isAdmin ? (
          <Textarea
            id="vendorListEdit"
            value={vendorList}
            onChange={(e) => onUpdateField("vendorList", e.target.value)}
            rows={4}
            className="resize-none"
          />
        ) : (
          <p id="vendorListDisplay" className="text-sm">
            {vendorList}
          </p>
        )}
      </div>
    </div>
  );
}
