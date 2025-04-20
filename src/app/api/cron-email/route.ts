import nodemailer from "nodemailer";

// Create a transporter using Gmail SMTP + your App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function GET() {
  try {
    // send the email
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Daily Notifications",
      html: `<p>This is a test email:</p>
                <ul>
                  <li>Event A</li>
                  <li>Event B</li>
                </ul>`,
    });

    console.log("Email sent:", info.messageId);
    return new Response(JSON.stringify({ message: "Email sent.", messageId: info.messageId }), { status: 200 });
  } catch (err: any) {
    console.error("SMTP error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
