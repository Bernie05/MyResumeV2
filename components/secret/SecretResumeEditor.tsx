"use client";

import ResumePage from "@/components/resume/ResumePage";
import { useThemeContext } from "@/context/ThemeContext";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioItem,
  ProjectItem,
  ResumeData,
  ResumeStats,
  SkillCategory,
  SkillItem,
} from "@/types/resume";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { SecretEditorSkeleton } from "@/components/secret/SecretSkeletons";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "resume-secret-draft";
const LEGACY_DRAFT_STORAGE_KEY = "resume-studio-draft";

const EDITOR_SECTIONS = [
  { value: "personalInfo", label: "Personal Info" },
  { value: "stats", label: "Stats" },
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
  { value: "portfolio", label: "Portfolio" },
  { value: "certifications", label: "Certifications" },
] as const;

type EditorSection = (typeof EDITOR_SECTIONS)[number]["value"];

interface SecretResumeEditorProps {
  initialResume: ResumeData;
}

const cloneResumeData = (data: ResumeData): ResumeData => {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
};

const textToLines = (value: string): string[] => {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const linesToText = (value: string[]): string => {
  return value.join("\n");
};

const textToCsv = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const csvToText = (value: string[]): string => {
  return value.join(", ");
};

const getNextId = (items: Array<{ id: number }>): number => {
  return items.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1;
};

const clampProficiency = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

const replaceItemAtIndex = <T,>(
  items: T[],
  index: number,
  nextItem: T,
): T[] => {
  return items.map((item, currentIndex) =>
    currentIndex === index ? nextItem : item,
  );
};

const removeItemAtIndex = <T,>(items: T[], index: number): T[] => {
  return items.filter((_, currentIndex) => currentIndex !== index);
};

const createEmptyExperienceItem = (items: ExperienceItem[]): ExperienceItem => {
  return {
    id: getNextId(items),
    company: "",
    position: "",
    duration: "",
    location: "",
    description: [],
  };
};

const createEmptyEducationItem = (items: EducationItem[]): EducationItem => {
  return {
    id: getNextId(items),
    school: "",
    degree: "",
    field: "",
    year: "",
    location: "",
  };
};

const createEmptyProjectItem = (items: ProjectItem[]): ProjectItem => {
  return {
    id: getNextId(items),
    name: "",
    description: "",
    technologies: [],
    link: "",
    image: "",
    demoUrl: "",
    caseStudy: "",
  };
};

const createEmptyPortfolioItem = (items: PortfolioItem[]): PortfolioItem => {
  return {
    id: getNextId(items),
    title: "",
    description: "",
    longDescription: "",
    category: "",
    technologies: [],
    image: "",
    demoUrl: "",
    githubUrl: "",
    results: [],
    testimonial: "",
    client: "",
  };
};

const createEmptyCertificationItem = (
  items: CertificationItem[],
): CertificationItem => {
  return {
    id: getNextId(items),
    name: "",
    issuer: "",
    year: "",
  };
};

const createEmptySkillCategory = (): SkillCategory => {
  return {
    category: "",
    items: [{ name: "", proficiency: 50 }],
  };
};

const createEmptySkillItem = (): SkillItem => {
  return {
    name: "",
    proficiency: 50,
  };
};

const SecretResumeEditor = ({ initialResume }: SecretResumeEditorProps) => {
  const router = useRouter();
  const { isDarkMode } = useThemeContext();
  const [activeSection, setActiveSection] =
    useState<EditorSection>("personalInfo");
  const [draft, setDraft] = useState<ResumeData>(() =>
    cloneResumeData(initialResume),
  );
  const [savedDraft, setSavedDraft] = useState<ResumeData>(() =>
    cloneResumeData(initialResume),
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const baseline = cloneResumeData(initialResume);
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    const legacySavedValue = savedValue
      ? null
      : window.localStorage.getItem(LEGACY_DRAFT_STORAGE_KEY);
    const storedValue = savedValue ?? legacySavedValue;

    if (!storedValue) {
      setDraft(baseline);
      setSavedDraft(baseline);
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(storedValue) as ResumeData;

      if (legacySavedValue) {
        window.localStorage.setItem(STORAGE_KEY, legacySavedValue);
        window.localStorage.removeItem(LEGACY_DRAFT_STORAGE_KEY);
      }

      setDraft(parsed);
      setSavedDraft(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_DRAFT_STORAGE_KEY);
      setDraft(baseline);
      setSavedDraft(baseline);
      setError(
        "Saved private draft was invalid and has been reset to the baseline resume.",
      );
    } finally {
      setIsHydrated(true);
    }
  }, [initialResume]);

  const hasUnsavedChanges =
    isHydrated && JSON.stringify(draft) !== JSON.stringify(savedDraft);

  const updateStatsField = (field: keyof ResumeStats, value: string) => {
    setDraft((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [field]: Number(value) || 0,
      },
    }));
  };

  const handleSaveDraft = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSavedDraft(cloneResumeData(draft));
    setNotice("Draft saved locally in this browser.");
  };

  const handleDiscardChanges = () => {
    setDraft(cloneResumeData(savedDraft));
    setNotice("Unsaved changes discarded.");
  };

  const handleResetToBaseline = () => {
    const baseline = cloneResumeData(initialResume);
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_DRAFT_STORAGE_KEY);
    setDraft(baseline);
    setSavedDraft(baseline);
    setNotice("Draft reset to the static resume baseline.");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await signOut({
        callbackUrl: "/secret/login",
        redirect: false,
      });

      router.replace(result.url || "/secret/login");
      router.refresh();
    } catch {
      router.replace("/secret/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_DRAFT_STORAGE_KEY);
    }
  };

  const renderSectionEditor = () => {
    switch (activeSection) {
      case "personalInfo":
        return (
          <Stack spacing={2}>
            <TextField
              label="Full name"
              value={draft.personalInfo.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    name: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Title"
              value={draft.personalInfo.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    title: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Email"
              value={draft.personalInfo.email}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    email: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Phone"
              value={draft.personalInfo.phone}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    phone: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Location"
              value={draft.personalInfo.location}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    location: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Website"
              value={draft.personalInfo.website}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    website: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="LinkedIn"
              value={draft.personalInfo.linkedin}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    linkedin: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="GitHub"
              value={draft.personalInfo.github}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    github: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Photo URL"
              value={draft.personalInfo.photoUrl}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    photoUrl: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Background image URL"
              value={draft.personalInfo.backgroundUrl}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    backgroundUrl: event.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Summary"
              value={draft.personalInfo.summary}
              multiline
              minRows={5}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  personalInfo: {
                    ...current.personalInfo,
                    summary: event.target.value,
                  },
                }))
              }
            />
          </Stack>
        );
      case "stats":
        return (
          <Stack spacing={2}>
            <TextField
              label="Years of experience"
              type="number"
              value={draft.stats.yearsExperience}
              onChange={(event) =>
                updateStatsField("yearsExperience", event.target.value)
              }
            />
            <TextField
              label="Completed projects"
              type="number"
              value={draft.stats.projects}
              onChange={(event) =>
                updateStatsField("projects", event.target.value)
              }
            />
            <TextField
              label="Clients"
              type="number"
              value={draft.stats.clients}
              onChange={(event) =>
                updateStatsField("clients", event.target.value)
              }
            />
            <TextField
              label="Awards"
              type="number"
              value={draft.stats.awards}
              onChange={(event) =>
                updateStatsField("awards", event.target.value)
              }
            />
          </Stack>
        );
      case "experience":
        return (
          <Stack spacing={2.5}>
            {draft.experience.map((item, index) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Experience #{index + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove experience"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            experience: removeItemAtIndex(
                              current.experience,
                              index,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Company"
                      value={item.company}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          company: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          experience: replaceItemAtIndex(
                            current.experience,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Position"
                      value={item.position}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          position: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          experience: replaceItemAtIndex(
                            current.experience,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Duration"
                      value={item.duration}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          duration: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          experience: replaceItemAtIndex(
                            current.experience,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Location"
                      value={item.location}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          location: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          experience: replaceItemAtIndex(
                            current.experience,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Responsibilities"
                      value={linesToText(item.description)}
                      multiline
                      minRows={4}
                      helperText="One line per bullet."
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          description: textToLines(event.target.value),
                        };
                        setDraft((current) => ({
                          ...current,
                          experience: replaceItemAtIndex(
                            current.experience,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  experience: [
                    ...current.experience,
                    createEmptyExperienceItem(current.experience),
                  ],
                }))
              }
            >
              Add experience
            </Button>
          </Stack>
        );
      case "education":
        return (
          <Stack spacing={2.5}>
            {draft.education.map((item, index) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Education #{index + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove education"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            education: removeItemAtIndex(
                              current.education,
                              index,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="School"
                      value={item.school}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          school: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          education: replaceItemAtIndex(
                            current.education,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Degree"
                      value={item.degree}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          degree: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          education: replaceItemAtIndex(
                            current.education,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Field"
                      value={item.field}
                      onChange={(event) => {
                        const nextItem = { ...item, field: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          education: replaceItemAtIndex(
                            current.education,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Year"
                      value={item.year}
                      onChange={(event) => {
                        const nextItem = { ...item, year: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          education: replaceItemAtIndex(
                            current.education,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Location"
                      value={item.location}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          location: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          education: replaceItemAtIndex(
                            current.education,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  education: [
                    ...current.education,
                    createEmptyEducationItem(current.education),
                  ],
                }))
              }
            >
              Add education
            </Button>
          </Stack>
        );
      case "skills":
        return (
          <Stack spacing={2.5}>
            {draft.skills.map((category, categoryIndex) => (
              <Card
                key={`${category.category}-${categoryIndex}`}
                variant="outlined"
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Skill category #{categoryIndex + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove skill category"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            skills: removeItemAtIndex(
                              current.skills,
                              categoryIndex,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>

                    <TextField
                      label="Category name"
                      value={category.category}
                      onChange={(event) => {
                        const nextCategory = {
                          ...category,
                          category: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          skills: replaceItemAtIndex(
                            current.skills,
                            categoryIndex,
                            nextCategory,
                          ),
                        }));
                      }}
                    />

                    {category.items.map((item, itemIndex) => (
                      <Stack
                        key={`${item.name}-${itemIndex}`}
                        direction={{ xs: "column", md: "row" }}
                        spacing={1.5}
                        alignItems={{ md: "center" }}
                      >
                        <TextField
                          label="Skill"
                          value={item.name}
                          onChange={(event) => {
                            const nextItems = replaceItemAtIndex(
                              category.items,
                              itemIndex,
                              {
                                ...item,
                                name: event.target.value,
                              },
                            );
                            setDraft((current) => ({
                              ...current,
                              skills: replaceItemAtIndex(
                                current.skills,
                                categoryIndex,
                                {
                                  ...category,
                                  items: nextItems,
                                },
                              ),
                            }));
                          }}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Proficiency"
                          type="number"
                          value={item.proficiency}
                          onChange={(event) => {
                            const nextItems = replaceItemAtIndex(
                              category.items,
                              itemIndex,
                              {
                                ...item,
                                proficiency: clampProficiency(
                                  Number(event.target.value) || 0,
                                ),
                              },
                            );
                            setDraft((current) => ({
                              ...current,
                              skills: replaceItemAtIndex(
                                current.skills,
                                categoryIndex,
                                {
                                  ...category,
                                  items: nextItems,
                                },
                              ),
                            }));
                          }}
                          sx={{ width: { xs: "100%", md: 140 } }}
                        />
                        <IconButton
                          aria-label="Remove skill"
                          onClick={() => {
                            const nextItems = removeItemAtIndex(
                              category.items,
                              itemIndex,
                            );
                            setDraft((current) => ({
                              ...current,
                              skills: replaceItemAtIndex(
                                current.skills,
                                categoryIndex,
                                {
                                  ...category,
                                  items: nextItems,
                                },
                              ),
                            }));
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Stack>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setDraft((current) => ({
                          ...current,
                          skills: replaceItemAtIndex(
                            current.skills,
                            categoryIndex,
                            {
                              ...category,
                              items: [
                                ...category.items,
                                createEmptySkillItem(),
                              ],
                            },
                          ),
                        }));
                      }}
                    >
                      Add skill
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  skills: [...current.skills, createEmptySkillCategory()],
                }))
              }
            >
              Add skill category
            </Button>
          </Stack>
        );
      case "projects":
        return (
          <Stack spacing={2.5}>
            {draft.projects.map((item, index) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Project #{index + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove project"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            projects: removeItemAtIndex(
                              current.projects,
                              index,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Project name"
                      value={item.name}
                      onChange={(event) => {
                        const nextItem = { ...item, name: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Description"
                      value={item.description}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          description: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Technologies"
                      helperText="Comma-separated values."
                      value={csvToText(item.technologies)}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          technologies: textToCsv(event.target.value),
                        };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Link"
                      value={item.link}
                      onChange={(event) => {
                        const nextItem = { ...item, link: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Image URL"
                      value={item.image}
                      onChange={(event) => {
                        const nextItem = { ...item, image: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Demo URL"
                      value={item.demoUrl}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          demoUrl: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Case study"
                      value={item.caseStudy}
                      multiline
                      minRows={4}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          caseStudy: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          projects: replaceItemAtIndex(
                            current.projects,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  projects: [
                    ...current.projects,
                    createEmptyProjectItem(current.projects),
                  ],
                }))
              }
            >
              Add project
            </Button>
          </Stack>
        );
      case "portfolio":
        return (
          <Stack spacing={2.5}>
            {draft.portfolio.map((item, index) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Portfolio item #{index + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove portfolio item"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            portfolio: removeItemAtIndex(
                              current.portfolio,
                              index,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Title"
                      value={item.title}
                      onChange={(event) => {
                        const nextItem = { ...item, title: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Description"
                      value={item.description}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          description: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Long description"
                      value={item.longDescription}
                      multiline
                      minRows={4}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          longDescription: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Category"
                      value={item.category}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          category: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Technologies"
                      helperText="Comma-separated values."
                      value={csvToText(item.technologies)}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          technologies: textToCsv(event.target.value),
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Image URL"
                      value={item.image}
                      onChange={(event) => {
                        const nextItem = { ...item, image: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Demo URL"
                      value={item.demoUrl}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          demoUrl: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="GitHub URL"
                      value={item.githubUrl}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          githubUrl: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Results"
                      helperText="One line per result."
                      value={linesToText(item.results)}
                      multiline
                      minRows={3}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          results: textToLines(event.target.value),
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Testimonial"
                      value={item.testimonial}
                      multiline
                      minRows={3}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          testimonial: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Client"
                      value={item.client}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          client: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          portfolio: replaceItemAtIndex(
                            current.portfolio,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  portfolio: [
                    ...current.portfolio,
                    createEmptyPortfolioItem(current.portfolio),
                  ],
                }))
              }
            >
              Add portfolio item
            </Button>
          </Stack>
        );
      case "certifications":
        return (
          <Stack spacing={2.5}>
            {draft.certifications.map((item, index) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Certification #{index + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove certification"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            certifications: removeItemAtIndex(
                              current.certifications,
                              index,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Certification"
                      value={item.name}
                      onChange={(event) => {
                        const nextItem = { ...item, name: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          certifications: replaceItemAtIndex(
                            current.certifications,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Issuer"
                      value={item.issuer}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          issuer: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          certifications: replaceItemAtIndex(
                            current.certifications,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Year"
                      value={item.year}
                      onChange={(event) => {
                        const nextItem = { ...item, year: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          certifications: replaceItemAtIndex(
                            current.certifications,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  certifications: [
                    ...current.certifications,
                    createEmptyCertificationItem(current.certifications),
                  ],
                }))
              }
            >
              Add certification
            </Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  if (!isHydrated) {
    return <SecretEditorSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDarkMode
          ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid",
          borderColor: isDarkMode
            ? "rgba(51, 65, 85, 0.8)"
            : "rgba(203, 213, 225, 0.9)",
          backgroundColor: isDarkMode
            ? "rgba(2, 6, 23, 0.88)"
            : "rgba(248, 250, 252, 0.92)",
        }}
      >
        <Stack spacing={2} sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <Stack
            direction={{ xs: "column", xl: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.75}>
              <Typography
                variant="overline"
                sx={{ color: isDarkMode ? "#67e8f9" : "#0f766e" }}
              >
                Owner-only access
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Private Resume Editor
              </Typography>
              <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#475569" }}>
                Edit the local draft, preview the live resume UI, and keep the
                public site pinned to the static data source.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              alignItems={{ sm: "center" }}
            >
              <Chip
                label={
                  hasUnsavedChanges
                    ? "Unsaved changes"
                    : "Draft matches saved local copy"
                }
                color={hasUnsavedChanges ? "warning" : "success"}
                variant={hasUnsavedChanges ? "filled" : "outlined"}
              />
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveDraft}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Save draft
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleDiscardChanges}
                disabled={!hasUnsavedChanges}
                sx={{ textTransform: "none" }}
              >
                Discard changes
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<SettingsBackupRestoreIcon />}
                onClick={handleResetToBaseline}
                sx={{ textTransform: "none" }}
              >
                Reset to baseline
              </Button>
              <Button
                variant="text"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>

          <Tabs
            value={activeSection}
            onChange={(_, value: EditorSection) => setActiveSection(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {EDITOR_SECTIONS.map((section) => (
              <Tab
                key={section.value}
                value={section.value}
                label={section.label}
              />
            ))}
          </Tabs>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "420px minmax(0, 1fr)" },
          gap: 3,
          alignItems: "start",
          px: { xs: 2, md: 3 },
          py: 3,
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(51, 65, 85, 0.8)"
              : "rgba(203, 213, 225, 0.9)",
            backgroundColor: isDarkMode
              ? "rgba(15, 23, 42, 0.94)"
              : "rgba(255, 255, 255, 0.94)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {
                  EDITOR_SECTIONS.find(
                    (section) => section.value === activeSection,
                  )?.label
                }
              </Typography>
              <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                Changes update the preview immediately. Save when you want this
                browser to keep the draft.
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            {renderSectionEditor()}
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(51, 65, 85, 0.8)"
              : "rgba(203, 213, 225, 0.9)",
            backgroundColor: isDarkMode
              ? "rgba(15, 23, 42, 0.94)"
              : "rgba(255, 255, 255, 0.94)",
          }}
        >
          <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2.5 }}>
            <Stack spacing={0.75}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Live preview
              </Typography>
              <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                This reuses the public resume renderer so preview fidelity stays
                aligned with the visitor experience.
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <Box
            sx={{ maxHeight: { xl: "calc(100vh - 190px)" }, overflowY: "auto" }}
          >
            <ResumePage resume={draft} position="static" />
          </Box>
        </Card>
      </Box>

      <Snackbar
        open={Boolean(notice) || Boolean(error)}
        autoHideDuration={4000}
        onClose={() => {
          setNotice(null);
          setError(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => {
            setNotice(null);
            setError(null);
          }}
          sx={{ width: "100%" }}
        >
          {error ?? notice}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SecretResumeEditor;
