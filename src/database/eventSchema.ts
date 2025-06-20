import mongoose, { Schema, Document } from "mongoose";

type IEvent = Document & {
  clerkId: string;
  clientName: string;
  docIds: mongoose.Types.ObjectId[];
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
};

const EventSchema = new Schema<IEvent>({
  clerkId: { type: String, ref: "User", required: true },
  clientName: { type: String, required: true },
  docIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  venue: {
    type: String,
    enum: ["Full Facility", "Octagon Barn & Plaza", "Shed & Courtyard", "Milking Parlor", "Other"],
    required: true,
  },
  eventName: { type: String, required: true },
  eventDateStart: { type: Date, required: true },
  eventDateEnd: { type: Date, required: true },
  status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], required: true },
  eventDetails: { type: String, default: "No Event Description" },
  vendorList: { type: String, default: "No Vendor List" },
  createdAt: { type: Date, default: Date.now },
  docsTotal: { type: Number, default: 0 },
  docsCompleted: { type: Number, default: 0 },
  numGuests: { type: Number, default: 0 },
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
