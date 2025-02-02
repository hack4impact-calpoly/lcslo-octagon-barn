import mongoose, { Schema } from "mongoose";

type IEvent = Document & {
  clerkId: mongoose.Types.ObjectId;
  docIds: mongoose.Types.ObjectId[];
  venue: "TBD"; // update with venues
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
  eventDate: Date;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  createdAt: Date;
};

const EventSchema = new Schema<IEvent>({
  clerkId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  docIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  venue: { type: String, enum: ["TBD"], required: true }, // update with venues
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
  eventDate: { type: Date, required: true },
  status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
