import mongoose, { Schema, Document } from "mongoose";

type IAlert = Document & {
  eventId: mongoose.Types.ObjectId;
  alertDateTime: Date;
  updateType: "Event" | "DocUpload" | "DocReupload" | "DocApproval" | "DocRejected";
  descriptor: string;
  alertFrom: string;
  alertTo: string;
  isRead: Boolean;
};

const AlertSchema = new Schema<IAlert>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  alertDateTime: { type: Date, required: true },
  updateType: {
    type: String,
    enum: ["Event", "DocUpload", "DocReupload", "DocApproval", "DocRejected"],
    required: true,
  },
  descriptor: { type: String, required: true },
  alertFrom: { type: String, required: true },
  alertTo: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

export default mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);
