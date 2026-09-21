import { ResumeData } from "@/types/resume";
import { Typography } from "@mui/material";

const Footer = (data: ResumeData, props = {}, sx = {}) => {
  return (
    <Typography variant="body2" sx={{ ...sx }} {...props}>
      {new Date().getFullYear()} © {data.personalInfo.name}. All rights
      reserved.
    </Typography>
  );
};

export default Footer;
