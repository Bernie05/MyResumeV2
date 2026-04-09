import SecretResumeEditor from "@/components/secret/SecretResumeEditor";
import { resumeData } from "@/data/resume";

const SecretPage = () => {
  return <SecretResumeEditor initialResume={resumeData} />;
};

export default SecretPage;
