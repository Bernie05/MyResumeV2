import type { ResumeData } from "@/types/resume";

/**
 * Builds the CV PDF in the browser and triggers a download.
 * @react-pdf/renderer is imported on demand so it only loads when a visitor
 * actually clicks "Download CV", not with the rest of the page.
 */
export const downloadResumePdf = async (resume: ResumeData) => {
  const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./ResumePdfDocument"),
  ]);

  const blob = await pdf(<ResumePdfDocument resume={resume} />).toBlob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${resume.personalInfo.name.replace(/[^\w]+/g, "_")}_CV.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking right away can cancel the download in some browsers
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};
