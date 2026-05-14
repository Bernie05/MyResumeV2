import ResumePage from "@/components/resume/ResumePage";
import { resumeData } from "@/data/resume";

const MainView = () => {
  return <ResumePage resume={resumeData} editorProps={{}} />;
};

export default MainView;
