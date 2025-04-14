import mongoose, { Schema, Document } from "mongoose";

type IEvent = Document & {
  clerkId: string;
  docIds: mongoose.Types.ObjectId[];
  venue: "The Octagon Barn" | "The Milking Parlor" | "The Shed and Courtyard";
  eventName: string;
  eventType:
    | "Wedding"
    | "General Meeting"
    | "Non-Profit"
    | "Fundraiser"
    | "Family Gathering"
    | "Quinceanera"
    | "Holiday Party"
    | "Dance/Formal/Prom"
    | "Cal Poly Events"
    | "Cal Poly Greek Event"
    | "Concert - Public"
    | "Other"
    | "Internal - LCSLO Event";
  eventDateStart: Date;
  eventDateEnd: Date;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  createdAt: Date;
  docsTotal: number;
  docsCompleted: number;
  numPeople: number;
};

const EventSchema = new Schema<IEvent>({
  clerkId: { type: String, ref: "User", required: true },
  docIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  venue: {
    type: String,
    enum: ["The Octagon Barn", "The Milking Parlor", "The Shed and Courtyard"],
    required: true,
  },
  eventName: { type: String, required: true },
  eventType: {
    type: String,
    enum: [
      "Wedding",
      "General Meeting",
      "Non-Profit",
      "Fundraiser",
      "Family Gathering",
      "Quinceanera",
      "Holiday Party",
      "Dance/Formal/Prom",
      "Cal Poly Events",
      "Cal Poly Greek Event",
      "Concert - Public",
      "Other",
      "Internal - LCSLO Event",
    ],
    required: true,
  },
  eventDateStart: { type: Date, required: true },
  eventDateEnd: { type: Date, required: true },
  status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], required: true },
  createdAt: { type: Date, default: Date.now },
  docsTotal: { type: Number, default: 0 },
  docsCompleted: { type: Number, default: 0 },
  numPeople: { type: Number, default: 0 },
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
