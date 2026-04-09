import SecretResumeEditor from "@/components/studio/SecretResumeEditor";
import { resumeData } from "@/data/resume";

export default function SecretPage() {
  return <SecretResumeEditor initialResume={resumeData} />;
}
