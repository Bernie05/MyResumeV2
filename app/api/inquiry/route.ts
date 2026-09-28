import { NextResponse } from "next/server";

export interface InquiryPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
  // Honeypot: hidden from people, so only bots fill it in
  website?: string;
}

const MAX_LENGTH: Record<keyof InquiryPayload, number> = {
  name: 100,
  email: 200,
  company: 150,
  phone: 50,
  subject: 200,
  message: 5000,
  website: 200,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Emails a contact-form inquiry to the site owner via Resend.
 * The recipient is fixed server-side (INQUIRY_TO_EMAIL); the visitor's address is only used as Reply-To.
 */
export async function POST(request: Request) {
  const {
    RESEND_API_KEY,
    INQUIRY_TO_EMAIL,
    INQUIRY_FROM_EMAIL = "Resume Inquiry <onboarding@resend.dev>",
  } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL) {
    console.error("[api/inquiry] RESEND_API_KEY or INQUIRY_TO_EMAIL is missing");
    return NextResponse.json(
      { error: "Inquiry email is not configured" },
      { status: 500 },
    );
  }

  let body: Partial<Record<keyof InquiryPayload, unknown>>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Normalize every field to a trimmed, length-capped string
  const data = Object.fromEntries(
    (Object.keys(MAX_LENGTH) as (keyof InquiryPayload)[]).map((key) => [
      key,
      typeof body?.[key] === "string"
        ? (body[key] as string).trim().slice(0, MAX_LENGTH[key])
        : "",
    ]),
  ) as Required<InquiryPayload>;

  // Pretend success to bots so they don't retry
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!data.name || !data.message || !EMAIL_PATTERN.test(data.email)) {
    return NextResponse.json(
      { error: "Name, a valid email, and project details are required" },
      { status: 400 },
    );
  }

  const details = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company && `Company: ${data.company}`,
    data.phone && `Phone: ${data.phone}`,
    data.subject && `Subject: ${data.subject}`,
  ]
    .filter(Boolean)
    .join("\n");
  const text = `${details}\n\n${data.message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: INQUIRY_FROM_EMAIL,
      to: [INQUIRY_TO_EMAIL],
      reply_to: data.email,
      subject: `New inquiry: ${data.subject || `from ${data.name}`}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("[api/inquiry] Resend send failed:", await res.text());
    return NextResponse.json(
      { error: "Could not send your inquiry. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
