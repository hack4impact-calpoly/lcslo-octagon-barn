export interface IEventFrontend {
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

export interface ITempEventData {
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
