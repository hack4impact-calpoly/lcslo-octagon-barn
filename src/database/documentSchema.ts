import mongoose, { Schema, Document } from "mongoose";

type IDocument = Document & {
  clerkId: string;
  eventId: mongoose.Types.ObjectId;
  s3DocId: string;
  documentType: string;
  createdAt: Date;
  status: "Completed" | "Pending" | "Not Submitted";
  checkList: string[];
};

const DocumentSchema = new Schema<IDocument>({
  clerkId: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  s3DocId: { type: String, required: true },
  documentType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Completed", "Pending", "Not Submitted"],
    default: "Not Submitted",
  },
  checkList: { type: [String], default: [] },
});

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
