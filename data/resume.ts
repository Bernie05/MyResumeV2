import type { ResumeData } from "@/types/resume";
import json from "./resume.json";

// Resume content lives in resume.json so the editor can publish it by
// committing that file to GitHub (see app/api/resume/route.ts).
export const resumeData: ResumeData = json as ResumeData;
