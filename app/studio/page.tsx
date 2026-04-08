import ResumeStudio from "@/components/studio/ResumeStudio";
import { resumeData } from "@/data/resume";

export default function StudioPage() {
  return <ResumeStudio initialResume={resumeData} />;
}
