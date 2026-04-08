import { resumeData } from "@/data/resume";
import ResumePage from "@/components/resume/ResumePage";

export default function Home() {
  return <ResumePage resume={resumeData} />;
}
