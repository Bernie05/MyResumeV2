import ResumePage from "@/components/resume/ResumePage";
import { resumeData } from "@/data/resume";

const MainView = () => {
  // dito ata pwede e add yung theme
  return <ResumePage resume={resumeData} />;
};

export default MainView;
