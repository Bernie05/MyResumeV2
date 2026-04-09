import { resumeData } from "@/data/resume";
import ResumePage from "@/components/resume/ResumePage";

const Home = () => {
  return <ResumePage resume={resumeData} />;
};

export default Home;
