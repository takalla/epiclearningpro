import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    service?: string;
    message?: string;
  };

  // Basic validation
  if (!firstName?.trim() || !lastName?.trim()) {
    res.status(400).json({ error: "First and last name are required." });
    return;
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }
  if (!service?.trim()) {
    res.status(400).json({ error: "Service of interest is required." });
    return;
  }
  if (!message?.trim()) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO_EMAIL ?? "contact@epiclearningpro.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    res.status(503).json({
      error: "Email service is not configured yet. Please contact us directly at contact@epiclearningpro.com",
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    await transporter.sendMail({
      from: `"Epic Learning Pro Website" <${smtpUser}>`,
      to: contactTo,
      replyTo: `"${fullName}" <${email}>`,
      subject: `Website Inquiry – ${service} – from ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        `Service of Interest: ${service}`,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <div style="background:linear-gradient(135deg,#8B5FE6,#36A6DD);padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:22px;">New Website Inquiry</h1>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Epic Learning Pro Contact Form</p>
          </div>
          <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${fullName}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#8B5FE6;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Service</td><td style="padding:8px 0;">${service}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
            <p style="color:#6b7280;font-size:14px;margin:0 0 8px;">Message</p>
            <p style="white-space:pre-wrap;margin:0;line-height:1.6;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">Reply directly to this email to reach ${fullName}.</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    res.status(500).json({ error: "Failed to send message. Please try emailing us directly at contact@epiclearningpro.com" });
  }
});

export default router;
