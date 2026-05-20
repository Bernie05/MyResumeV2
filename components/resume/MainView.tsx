"use client";

import { useEffect } from "react";
import ResumePage from "@/components/resume/ResumePage";
import { useResumeOperations, useResumeData } from "@/store/hooks";
import { resumeData } from "@/data/resume";

const MainView = () => {
  // Hooks to interact with resume data in Redux store
  const { loadResume } = useResumeOperations();
  // Get resume data from Redux store
  const storedResumeData = useResumeData();

  // Dispatch resume data to Redux store on mount
  useEffect(() => {
    if (!storedResumeData) {
      loadResume(resumeData);
    }
  }, [loadResume, storedResumeData]);

  // Use Redux store data if available, fallback to direct data
  const displayData = storedResumeData || resumeData;

  return <ResumePage resume={displayData} position="sticky" />;
};

export default MainView;
