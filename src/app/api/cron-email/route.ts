import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import Document from "@/database/documentSchema";
import Alert from "@/database/alertSchema";
import { format } from "date-fns";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const in14 = new Date(now);
    in14.setDate(now.getDate() + 14);
    const in30 = new Date(now);
    in30.setDate(now.getDate() + 30);

    const newAlerts = await Alert.find({ updateType: "DocUpload", alertTo: "admin", isRead: false });

    const [count14, count30] = await Promise.all([
      Event.countDocuments({
        eventDateStart: { $gte: now, $lte: in14 },
        $expr: { $lt: ["$docsCompleted", "$docsTotal"] },
      }),
      Event.countDocuments({
        eventDateStart: { $gt: in14, $lte: in30 },
        $expr: { $lt: ["$docsCompleted", "$docsTotal"] },
      }),
    ]);

    const pendingDocs = await Document.find({ status: "Pending" });

    const dateLabel = format(now, "MM/dd/yyyy");
    const subject = `[${dateLabel}]: Admin Octagon Barn Notifications`;

    let html = `<p>Hello Admin,</p>
      <p>Here are the daily updates for the Octagon Barn:</p>
      <ul>
        <li>Incomplete Events in 14 Days: ${count14}</li>
        <li>Incomplete Events in 30 Days: ${count30}</li>
        <li>Documents Awaiting Approval: ${pendingDocs.length}</li>
      </ul>`;

    if (newAlerts.length) {
      html += `<h3>New Document Uploads</h3><ul>`;
      newAlerts.forEach((a) => {
        html += `<li>${a.descriptor} at ${format(a.alertDateTime, "hh:mm a")}</li>`;
      });
      html += `</ul>`;
    }

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject,
      html,
    });

    if (newAlerts.length) {
      await Alert.updateMany({ _id: { $in: newAlerts.map((a) => a._id) } }, { $set: { isRead: true } });
    }

    console.log("Email sent:", info.messageId);
    return new Response(JSON.stringify({ message: "Email sent.", messageId: info.messageId }), { status: 200 });
  } catch (err: any) {
    console.error("SMTP error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
