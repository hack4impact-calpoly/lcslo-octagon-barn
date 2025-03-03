import mongoose, { Schema, Document } from "mongoose";

type IAlert = Document & {
  alertDateTime: Date;
  updateType: "Event" | "DocReupload" | "DocUpload" | "DocApproval";
  descriptor: string;
  alertFrom: string;
  alertTo: string;
  eventName: string;
  venue: string;
  eventDateTime: Date;
};

const AlertSchema = new Schema<IAlert>({
  alertDateTime: { type: Date, required: true },
  updateType: { type: String, enum: ["Event", "DocReupload", "DocUpload", "DocApproval"], required: true },
  descriptor: { type: String, required: true },
  alertFrom: { type: String, required: true },
  alertTo: { type: String, required: true },
  eventName: { type: String },
  venue: { type: String },
  eventDateTime: { type: Date },
});

export default mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);
