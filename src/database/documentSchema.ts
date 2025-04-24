import mongoose, { Schema, Document } from "mongoose";

type IDocument = Document & {
  clerkId: string;
  eventId: mongoose.Types.ObjectId;
  documentName: string;
  documentType: "Insurance/COI" | "Timeline" | "Layout" | "Other";
  s3DocIdAdmin: string;
  s3DocIdClient: string;
  createdAt: Date;
  uploadedAt: Date;
  status: "Completed" | "Pending" | "Not Submitted";
  checkList: string[];
};

const DocumentSchema = new Schema<IDocument>({
  clerkId: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  documentName: { type: String, required: true },
  documentType: {
    type: String,
    required: true,
    enum: ["Insurance/COI", "Timeline", "Layout", "Other"],
  },
  s3DocIdAdmin: { type: String },
  s3DocIdClient: { type: String },
  createdAt: { type: Date, default: Date.now },
  uploadedAt: { type: Date },
  status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending", "Not Submitted"],
    default: "Pending",
  },
  checkList: { type: [String], default: [] },
});

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
