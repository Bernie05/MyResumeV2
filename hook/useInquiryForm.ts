import { useState, type ChangeEvent, type FormEvent } from "react";
import type { InquiryPayload } from "@/app/api/inquiry/route";

export type InquiryStatus =
  | { state: "idle" | "sending" | "sent" }
  | { state: "error"; message: string };

const EMPTY_INQUIRY: Required<InquiryPayload> = {
  name: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

// Contact-form state + submission to /api/inquiry, shared by every template's
// contact section.
export const useInquiryForm = () => {
  const [inquiry, setInquiry] = useState(EMPTY_INQUIRY);
  const [status, setStatus] = useState<InquiryStatus>({ state: "idle" });
  const isSending = status.state === "sending";

  // Binds a text field to its inquiry key
  const inquiryField = (key: keyof InquiryPayload) => ({
    value: inquiry[key],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setInquiry((prev) => ({ ...prev, [key]: event.target.value })),
    disabled: isSending,
  });

  const handleInquirySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "Could not send your inquiry.");
      }
      setInquiry(EMPTY_INQUIRY);
      setStatus({ state: "sent" });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Could not send your inquiry.",
      });
    }
  };

  return { inquiryField, handleInquirySubmit, status, isSending };
};
