"use client";

import ResumePage, {
  type ResumeEditableSection,
} from "@/components/resume/ResumePage";
import { useThemeContext } from "@/context/ThemeContext";
import type {
  CertificationItem,
  EducationItem,
  ResumeData,
  ResumeStats,
} from "@/types/resume";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { ICON_MAP, ICON_NAMES } from "@/components/resume/ServicesSection";
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
  Popover,
  Slider,
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
import {
  clampProficiency,
  cloneResumeData,
  createEmptyCertificationItem,
  createEmptyEducationItem,
  createEmptyExperienceItem,
  createEmptyPortfolioItem,
  createEmptyProjectItem,
  createEmptySkillCategory,
  createEmptySkillItem,
  csvToText,
  linesToText,
  removeItemAtIndex,
  replaceItemAtIndex,
  textToCsv,
  textToLines,
} from "./utils/util";
import { getInlineFieldLabel } from "./utils/componentUtil";
import { EDITOR_SECTIONS, InlineEditableFieldId } from "./constants/constant";

const STORAGE_KEY = "resume-secret-draft";
const LEGACY_DRAFT_STORAGE_KEY = "resume-studio-draft";

export type EditorSection = (typeof EDITOR_SECTIONS)[number]["value"];

interface SecretResumeEditorProps {
  initialResume: ResumeData;
}

export interface IEditorInterface {
  activeSectionId: ResumeEditableSection | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId | string,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: InlineEditableFieldId | string | null;
}

export type IEditorInlineFieldSxProps = Omit<
  IEditorInterface,
  "activeSectionId"
> & {
  fieldId: InlineEditableFieldId;
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
  const [selectedPreviewSection, setSelectedPreviewSection] =
    useState<ResumeEditableSection | null>(null);
  const [selectedInlineFieldId, setSelectedInlineFieldId] =
    useState<InlineEditableFieldId | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

  const handlePreviewClick = () => {
    setSelectedPreviewSection(null);
    setSelectedInlineFieldId(null);

    // Todo:
    // We need to handle this as a state
    router.replace("/cv");
    router.refresh();
  };

  const handlePreviewSectionClick = (section: ResumeEditableSection) => {
    setSelectedPreviewSection(section);
    setSelectedInlineFieldId(null);
    setActiveSection(PREVIEW_SECTION_TO_EDITOR_SECTION[section]);
  };

  const handleInlineFieldClick = (
    section: ResumeEditableSection,
    fieldId: string,
    anchor?: HTMLElement,
  ) => {
    const typedFieldId = fieldId as InlineEditableFieldId;
    setSelectedPreviewSection(section);
    setSelectedInlineFieldId(typedFieldId);
    setAnchorEl(anchor ?? null);
  };

  const handleCloseInlineEditor = () => {
    setAnchorEl(null);
    setSelectedInlineFieldId(null);
  };

  const handleAddAction = (action: string, anchor: HTMLElement) => {
    if (action === "experience") {
      setDraft((current) => ({
        ...current,
        experience: [
          ...current.experience,
          createEmptyExperienceItem(current.experience),
        ],
      }));
      setNotice("New experience added.");
      return;
    }

    const bulletMatch = action.match(/^experience\.(\d+)\.bullet$/);
    if (bulletMatch) {
      const expIndex = Number(bulletMatch[1]);
      const item = draft.experience[expIndex];
      if (item) {
        setDraft((current) => ({
          ...current,
          experience: replaceItemAtIndex(current.experience, expIndex, {
            ...item,
            description: [...item.description, ""],
          }),
        }));
        const bulletIndex = item.description.length;
        const fieldId =
          `experience.${expIndex}.description.${bulletIndex}` as InlineEditableFieldId;
        setSelectedPreviewSection("experience");
        setSelectedInlineFieldId(fieldId);
        setAnchorEl(anchor);
      }
      return;
    }

    if (action === "portfolio") {
      setDraft((current) => ({
        ...current,
        portfolio: [
          ...current.portfolio,
          createEmptyPortfolioItem(current.portfolio),
        ],
      }));
      setNotice("New portfolio item added.");
      return;
    }

    if (action === "projects") {
      setDraft((current) => ({
        ...current,
        projects: [
          ...current.projects,
          createEmptyProjectItem(current.projects),
        ],
      }));
      setNotice("New project added.");
      return;
    }

    if (action === "services") {
      setDraft((current) => ({
        ...current,
        skills: [...current.skills, createEmptySkillCategory()],
      }));
      setNotice("New skill category added.");
      return;
    }

    if (action === "social") {
      const socialLinks = draft.personalInfo.social ?? [];
      const nextSocial = [...socialLinks, { label: "", url: "" }];
      setDraft((current) => ({
        ...current,
        personalInfo: { ...current.personalInfo, social: nextSocial },
      }));
      const fieldId = "personalInfo.social.new" as InlineEditableFieldId;
      setSelectedPreviewSection("about");
      setSelectedInlineFieldId(fieldId);
      setAnchorEl(anchor);
      return;
    }

    if (action === "stat") {
      const customStats = draft.stats.custom ?? [];
      const nextCustom = [...customStats, { label: "", value: 0, suffix: "" }];
      setDraft((current) => ({
        ...current,
        stats: { ...current.stats, custom: nextCustom },
      }));
      const newIdx = nextCustom.length - 1;
      const fieldId = `stats.custom.${newIdx}` as InlineEditableFieldId;
      setSelectedPreviewSection("about");
      setSelectedInlineFieldId(fieldId);
      setAnchorEl(anchor);
      return;
    }

    if (action === "education") {
      setDraft((current) => ({
        ...current,
        education: [
          ...current.education,
          createEmptyEducationItem(current.education),
        ],
      }));
      setNotice("New education added.");
      return;
    }

    if (action === "certifications") {
      setDraft((current) => ({
        ...current,
        certifications: [
          ...current.certifications,
          createEmptyCertificationItem(current.certifications),
        ],
      }));
      setNotice("New certification added.");
      return;
    }

    const portfolioResultMatch = action.match(/^portfolio\.(\d+)\.result$/);
    if (portfolioResultMatch) {
      const portIndex = Number(portfolioResultMatch[1]);
      const item = draft.portfolio[portIndex];
      if (item) {
        setDraft((current) => ({
          ...current,
          portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
            ...item,
            results: [...item.results, ""],
          }),
        }));
        const resultIndex = item.results.length;
        const fieldId =
          `portfolio.${portIndex}.result.${resultIndex}` as InlineEditableFieldId;
        setSelectedPreviewSection("portfolio");
        setSelectedInlineFieldId(fieldId);
        setAnchorEl(anchor);
      }
      return;
    }

    const portfolioTechMatch = action.match(/^portfolio\.(\d+)\.tech$/);
    if (portfolioTechMatch) {
      const portIndex = Number(portfolioTechMatch[1]);
      const item = draft.portfolio[portIndex];
      if (item) {
        const fieldId =
          `portfolio.${portIndex}.technologies` as InlineEditableFieldId;
        setSelectedPreviewSection("portfolio");
        setSelectedInlineFieldId(fieldId);
        setAnchorEl(anchor);
      }
      return;
    }
  };

  const renderInlineFieldToolbox = () => {
    if (!selectedInlineFieldId) {
      return null;
    }

    if (selectedInlineFieldId.startsWith("personalInfo.")) {
      // Handle social links
      const socialMatch = selectedInlineFieldId.match(
        /^personalInfo\.social\.(.+)$/,
      );
      if (socialMatch) {
        const socialInfo = draft.personalInfo.social ?? [];
        return (
          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Social links (label : url)
            </Typography>
            {socialInfo.map(
              (
                s: { label: string; url: string; icon?: string },
                idx: number,
              ) => (
                <Stack key={idx} spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      size="small"
                      label="Label"
                      value={s.label}
                      sx={{ flex: 1 }}
                      onChange={(event) => {
                        const next = [...socialInfo];
                        next[idx] = { ...next[idx], label: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          personalInfo: {
                            ...current.personalInfo,
                            social: next,
                          },
                        }));
                      }}
                    />
                    <TextField
                      size="small"
                      label="URL"
                      value={s.url}
                      sx={{ flex: 2 }}
                      onChange={(event) => {
                        const next = [...socialInfo];
                        next[idx] = { ...next[idx], url: event.target.value };
                        setDraft((current) => ({
                          ...current,
                          personalInfo: {
                            ...current.personalInfo,
                            social: next,
                          },
                        }));
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const next = socialInfo.filter(
                          (_: unknown, i: number) => i !== idx,
                        );
                        setDraft((current) => ({
                          ...current,
                          personalInfo: {
                            ...current.personalInfo,
                            social: next,
                          },
                        }));
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Icon
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, 36px)",
                      gap: 0.5,
                    }}
                  >
                    {ICON_NAMES.map((iconKey) => {
                      const Icon = ICON_MAP[iconKey];
                      return (
                        <IconButton
                          key={iconKey}
                          size="small"
                          onClick={() => {
                            const next = [...socialInfo];
                            next[idx] = { ...next[idx], icon: iconKey };
                            setDraft((current) => ({
                              ...current,
                              personalInfo: {
                                ...current.personalInfo,
                                social: next,
                              },
                            }));
                          }}
                          sx={{
                            border: "1px solid",
                            borderColor:
                              s.icon === iconKey ? "primary.main" : "divider",
                            backgroundColor:
                              s.icon === iconKey
                                ? "action.selected"
                                : "transparent",
                            borderRadius: 1,
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} />
                        </IconButton>
                      );
                    })}
                  </Box>
                  <Divider />
                </Stack>
              ),
            )}
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                const next = [...socialInfo, { label: "", url: "" }];
                setDraft((current) => ({
                  ...current,
                  personalInfo: { ...current.personalInfo, social: next },
                }));
              }}
              sx={{ textTransform: "none" }}
            >
              Add social link
            </Button>
          </Stack>
        );
      }

      // Handle button text fields
      if (selectedInlineFieldId === "personalInfo.hireButtonText") {
        return (
          <TextField
            size="small"
            sx={{ mt: 1.5 }}
            label="Hire Button Text"
            value={draft.personalInfo.hireButtonText ?? "Hire Me"}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                personalInfo: {
                  ...current.personalInfo,
                  hireButtonText: event.target.value,
                },
              }))
            }
          />
        );
      }

      if (selectedInlineFieldId === "personalInfo.downloadButtonText") {
        return (
          <TextField
            size="small"
            sx={{ mt: 1.5 }}
            label="Download Button Text"
            value={draft.personalInfo.downloadButtonText ?? "Download CV"}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                personalInfo: {
                  ...current.personalInfo,
                  downloadButtonText: event.target.value,
                },
              }))
            }
          />
        );
      }

      const key = selectedInlineFieldId.replace(
        "personalInfo.",
        "",
      ) as keyof ResumeData["personalInfo"];
      const value = draft.personalInfo[key] ?? "";

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={getInlineFieldLabel(selectedInlineFieldId)}
          value={String(value)}
          multiline={key === "summary"}
          minRows={key === "summary" ? 4 : undefined}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              personalInfo: {
                ...current.personalInfo,
                [key]: event.target.value,
              },
            }))
          }
        />
      );
    }

    // Custom stats handler (stats.custom.N)
    const customStatMatch = selectedInlineFieldId.match(
      /^stats\.custom\.(\d+)$/,
    );

    if (customStatMatch) {
      const idx = Number(customStatMatch[1]);
      const customStats = draft.stats.custom ?? [];
      const item = customStats[idx];

      if (!item) return null;

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {getInlineFieldLabel(selectedInlineFieldId)}
          </Typography>
          <TextField
            size="small"
            label="Label"
            value={item.label}
            onChange={(event) => {
              const next = [...customStats];
              next[idx] = { ...item, label: event.target.value };
              setDraft((current) => ({
                ...current,
                stats: { ...current.stats, custom: next },
              }));
            }}
          />
          <TextField
            size="small"
            label="Value"
            type="number"
            value={item.value}
            onChange={(event) => {
              const next = [...customStats];
              next[idx] = { ...item, value: Number(event.target.value) };
              setDraft((current) => ({
                ...current,
                stats: { ...current.stats, custom: next },
              }));
            }}
          />
          <TextField
            size="small"
            label="Suffix (e.g. +, %, K)"
            value={item.suffix ?? ""}
            onChange={(event) => {
              const next = [...customStats];
              next[idx] = { ...item, suffix: event.target.value };
              setDraft((current) => ({
                ...current,
                stats: { ...current.stats, custom: next },
              }));
            }}
          />
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              const next = customStats.filter((_, i) => i !== idx);
              setDraft((current) => ({
                ...current,
                stats: { ...current.stats, custom: next },
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Delete Stat
          </Button>
        </Stack>
      );
    }

    if (selectedInlineFieldId.startsWith("stats.")) {
      const key = selectedInlineFieldId.replace(
        "stats.",
        "",
      ) as keyof ResumeData["stats"];

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={getInlineFieldLabel(selectedInlineFieldId)}
          type="number"
          value={draft.stats[key]}
          onChange={(event) => updateStatsField(key, event.target.value)}
        />
      );
    }

    const experienceMatch = selectedInlineFieldId.match(
      /^experience\.(\d+)\.(company|position|duration|location)$/,
    );

    if (experienceMatch) {
      const index = Number(experienceMatch[1]);
      const item = draft.experience[index];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Position"
            value={item.position}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, index, {
                  ...item,
                  position: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Company"
            value={item.company}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, index, {
                  ...item,
                  company: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Duration"
            value={item.duration}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, index, {
                  ...item,
                  duration: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Location"
            value={item.location}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, index, {
                  ...item,
                  location: event.target.value,
                }),
              }))
            }
          />
          <Divider />
          <Typography variant="caption" color="text.secondary">
            Bullet points
          </Typography>
          {item.description.map((bullet, bulletIndex) => (
            <Stack
              key={bulletIndex}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <TextField
                size="small"
                label={`Bullet #${bulletIndex + 1}`}
                value={bullet}
                sx={{ flex: 1 }}
                onChange={(event) => {
                  const nextDesc = [...item.description];
                  nextDesc[bulletIndex] = event.target.value;
                  setDraft((current) => ({
                    ...current,
                    experience: replaceItemAtIndex(current.experience, index, {
                      ...item,
                      description: nextDesc,
                    }),
                  }));
                }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  const nextDesc = item.description.filter(
                    (_, i) => i !== bulletIndex,
                  );
                  setDraft((current) => ({
                    ...current,
                    experience: replaceItemAtIndex(current.experience, index, {
                      ...item,
                      description: nextDesc,
                    }),
                  }));
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, index, {
                  ...item,
                  description: [...item.description, ""],
                }),
              }));
            }}
            sx={{ textTransform: "none" }}
          >
            Add bullet
          </Button>
          <Divider />
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                experience: removeItemAtIndex(current.experience, index),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove experience
          </Button>
        </Stack>
      );
    }

    // Experience bullet point clicked directly
    const experienceBulletMatch = selectedInlineFieldId.match(
      /^experience\.(\d+)\.description\.(\d+)$/,
    );

    if (experienceBulletMatch) {
      const expIndex = Number(experienceBulletMatch[1]);
      const bulletIndex = Number(experienceBulletMatch[2]);
      const item = draft.experience[expIndex];

      if (!item || !item.description[bulletIndex] === undefined) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={`Bullet #${bulletIndex + 1}`}
            value={item.description[bulletIndex] ?? ""}
            multiline
            minRows={2}
            onChange={(event) => {
              const nextDesc = [...item.description];
              nextDesc[bulletIndex] = event.target.value;
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, expIndex, {
                  ...item,
                  description: nextDesc,
                }),
              }));
            }}
          />
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              const nextDesc = item.description.filter(
                (_, i) => i !== bulletIndex,
              );
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, expIndex, {
                  ...item,
                  description: nextDesc,
                }),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove bullet
          </Button>
        </Stack>
      );
    }

    const projectMatch = selectedInlineFieldId.match(
      /^projects\.(\d+)\.(name|description|image|technologies|link|demoUrl|caseStudy)$/,
    );

    if (projectMatch) {
      const index = Number(projectMatch[1]);
      const item = draft.projects[index];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Project Name"
            value={item.name}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  name: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Description"
            value={item.description}
            multiline
            minRows={3}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  description: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Image URL"
            value={item.image}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  image: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Technologies (comma-separated)"
            value={csvToText(item.technologies)}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  technologies: textToCsv(event.target.value),
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Link"
            value={item.link}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  link: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Demo URL"
            value={item.demoUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  demoUrl: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Case Study"
            value={item.caseStudy}
            multiline
            minRows={3}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  caseStudy: event.target.value,
                }),
              }))
            }
          />
          <Divider />
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                projects: removeItemAtIndex(current.projects, index),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove project
          </Button>
        </Stack>
      );
    }

    const portfolioMatch = selectedInlineFieldId.match(
      /^portfolio\.(\d+)\.(name|description|image|longDescription|category|technologies|demoUrl|githubUrl|testimonial|client)$/,
    );

    if (portfolioMatch) {
      const index = Number(portfolioMatch[1]);
      const item = draft.portfolio[index];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Title"
            value={item.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  title: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Description"
            value={item.description}
            multiline
            minRows={2}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  description: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Long Description"
            value={item.longDescription}
            multiline
            minRows={3}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  longDescription: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Category"
            value={item.category}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  category: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Image URL"
            value={item.image}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  image: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Technologies (comma-separated)"
            value={csvToText(item.technologies)}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  technologies: textToCsv(event.target.value),
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Demo URL"
            value={item.demoUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  demoUrl: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="GitHub URL"
            value={item.githubUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  githubUrl: event.target.value,
                }),
              }))
            }
          />
          <Divider />
          <Typography variant="caption" color="text.secondary">
            Key Results
          </Typography>
          {item.results.map((result, resultIndex) => (
            <Stack
              key={resultIndex}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <TextField
                size="small"
                label={`Result #${resultIndex + 1}`}
                value={result}
                sx={{ flex: 1 }}
                onChange={(event) => {
                  const nextResults = [...item.results];
                  nextResults[resultIndex] = event.target.value;
                  setDraft((current) => ({
                    ...current,
                    portfolio: replaceItemAtIndex(current.portfolio, index, {
                      ...item,
                      results: nextResults,
                    }),
                  }));
                }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  const nextResults = item.results.filter(
                    (_, i) => i !== resultIndex,
                  );
                  setDraft((current) => ({
                    ...current,
                    portfolio: replaceItemAtIndex(current.portfolio, index, {
                      ...item,
                      results: nextResults,
                    }),
                  }));
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  results: [...item.results, ""],
                }),
              }));
            }}
            sx={{ textTransform: "none" }}
          >
            Add result
          </Button>
          <Divider />
          <TextField
            size="small"
            label="Testimonial"
            value={item.testimonial}
            multiline
            minRows={2}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  testimonial: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Client"
            value={item.client}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  client: event.target.value,
                }),
              }))
            }
          />
          <Divider />
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                portfolio: removeItemAtIndex(current.portfolio, index),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove portfolio item
          </Button>
        </Stack>
      );
    }

    // Portfolio result clicked directly
    const portfolioResultMatch = selectedInlineFieldId.match(
      /^portfolio\.(\d+)\.result\.(\d+)$/,
    );

    if (portfolioResultMatch) {
      const portIndex = Number(portfolioResultMatch[1]);
      const resultIndex = Number(portfolioResultMatch[2]);
      const item = draft.portfolio[portIndex];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={`Result #${resultIndex + 1}`}
            value={item.results[resultIndex] ?? ""}
            multiline
            minRows={2}
            onChange={(event) => {
              const nextResults = [...item.results];
              nextResults[resultIndex] = event.target.value;
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
                  ...item,
                  results: nextResults,
                }),
              }));
            }}
          />
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              const nextResults = item.results.filter(
                (_, i) => i !== resultIndex,
              );
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
                  ...item,
                  results: nextResults,
                }),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove result
          </Button>
        </Stack>
      );
    }

    const educationMatch = selectedInlineFieldId.match(
      /^education\.(\d+)\.(school|degree|year|location)$/,
    );

    if (educationMatch) {
      const index = Number(educationMatch[1]);
      const key = educationMatch[2] as keyof EducationItem;
      const item = draft.education[index];

      if (!item) {
        return null;
      }

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={getInlineFieldLabel(selectedInlineFieldId)}
          value={String(item[key] ?? "")}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              education: replaceItemAtIndex(current.education, index, {
                ...item,
                [key]: event.target.value,
              }),
            }))
          }
        />
      );
    }

    // --- servicesTitle / servicesSubtitle ---
    if (selectedInlineFieldId === "servicesTitle") {
      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label="Services Title"
          value={draft.servicesTitle ?? ""}
          placeholder="What I Offer"
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              servicesTitle: event.target.value,
            }))
          }
        />
      );
    }

    if (selectedInlineFieldId === "servicesSubtitle") {
      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label="Services Subtitle"
          value={draft.servicesSubtitle ?? ""}
          placeholder="Professional services tailored to your project needs"
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              servicesSubtitle: event.target.value,
            }))
          }
        />
      );
    }

    // --- skills.N.icon ---
    const skillsCategoryIconMatch = selectedInlineFieldId.match(
      /^skills\.(\d+)\.icon$/,
    );

    if (skillsCategoryIconMatch) {
      const index = Number(skillsCategoryIconMatch[1]);
      const category = draft.skills[index];

      if (!category) return null;

      return (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {getInlineFieldLabel(selectedInlineFieldId)}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {ICON_NAMES.map((key) => {
              const Ic = ICON_MAP[key];
              return (
                <IconButton
                  key={key}
                  size="small"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      skills: replaceItemAtIndex(current.skills, index, {
                        ...category,
                        icon: key,
                      }),
                    }))
                  }
                  sx={{
                    border:
                      category.icon === key
                        ? "2px solid"
                        : "1px solid transparent",
                    borderColor:
                      category.icon === key ? "primary.main" : "transparent",
                    borderRadius: 1,
                  }}
                  title={key}
                >
                  <Ic fontSize="small" />
                </IconButton>
              );
            })}
          </Box>
        </Stack>
      );
    }

    // --- skills.N.subtitle ---
    const skillsCategorySubtitleMatch = selectedInlineFieldId.match(
      /^skills\.(\d+)\.subtitle$/,
    );

    if (skillsCategorySubtitleMatch) {
      const index = Number(skillsCategorySubtitleMatch[1]);
      const category = draft.skills[index];

      if (!category) return null;

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={getInlineFieldLabel(selectedInlineFieldId)}
          value={category.subtitle ?? ""}
          placeholder={`Expert ${category.category.toLowerCase()} solutions`}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              skills: replaceItemAtIndex(current.skills, index, {
                ...category,
                subtitle: event.target.value,
              }),
            }))
          }
        />
      );
    }

    // --- skills.N.category (comprehensive form) ---
    const skillsCategoryMatch = selectedInlineFieldId.match(
      /^skills\.(\d+)\.category$/,
    );

    if (skillsCategoryMatch) {
      const index = Number(skillsCategoryMatch[1]);
      const category = draft.skills[index];

      if (!category) {
        return null;
      }

      return (
        <Stack spacing={2} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Category Name"
            value={category.category}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, index, {
                  ...category,
                  category: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Subtitle"
            value={category.subtitle ?? ""}
            placeholder={`Expert ${category.category.toLowerCase()} solutions`}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, index, {
                  ...category,
                  subtitle: event.target.value,
                }),
              }))
            }
          />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
              Category Icon
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {ICON_NAMES.map((key) => {
                const Ic = ICON_MAP[key];
                return (
                  <IconButton
                    key={key}
                    size="small"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        skills: replaceItemAtIndex(current.skills, index, {
                          ...category,
                          icon: key,
                        }),
                      }))
                    }
                    sx={{
                      border:
                        category.icon === key
                          ? "2px solid"
                          : "1px solid transparent",
                      borderColor:
                        category.icon === key ? "primary.main" : "transparent",
                      borderRadius: 1,
                    }}
                    title={key}
                  >
                    <Ic fontSize="small" />
                  </IconButton>
                );
              })}
            </Box>
          </Box>
          <Divider />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Skills ({category.items.length})
          </Typography>
          {category.items.map((item, itemIdx) => (
            <Stack
              key={itemIdx}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <TextField
                size="small"
                label="Name"
                value={item.name}
                sx={{ flex: 1 }}
                onChange={(event) => {
                  const nextItems = replaceItemAtIndex(
                    category.items,
                    itemIdx,
                    {
                      ...item,
                      name: event.target.value,
                    },
                  );
                  setDraft((current) => ({
                    ...current,
                    skills: replaceItemAtIndex(current.skills, index, {
                      ...category,
                      items: nextItems,
                    }),
                  }));
                }}
              />
              <TextField
                size="small"
                label="%"
                type="number"
                value={item.proficiency}
                sx={{ width: 70 }}
                inputProps={{ min: 0, max: 100 }}
                onChange={(event) => {
                  const nextItems = replaceItemAtIndex(
                    category.items,
                    itemIdx,
                    {
                      ...item,
                      proficiency: Math.min(
                        100,
                        Math.max(0, Number(event.target.value)),
                      ),
                    },
                  );
                  setDraft((current) => ({
                    ...current,
                    skills: replaceItemAtIndex(current.skills, index, {
                      ...category,
                      items: nextItems,
                    }),
                  }));
                }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  const nextItems = category.items.filter(
                    (_, i) => i !== itemIdx,
                  );
                  setDraft((current) => ({
                    ...current,
                    skills: replaceItemAtIndex(current.skills, index, {
                      ...category,
                      items: nextItems,
                    }),
                  }));
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, index, {
                  ...category,
                  items: [...category.items, createEmptySkillItem()],
                }),
              }));
            }}
            sx={{ textTransform: "none" }}
          >
            Add Skill
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              setDraft((current) => ({
                ...current,
                skills: current.skills.filter((_, i) => i !== index),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Delete Category
          </Button>
        </Stack>
      );
    }

    // --- skills.N.N.name (comprehensive skill item form) ---
    const skillsItemMatch = selectedInlineFieldId.match(
      /^skills\.(\d+)\.(\d+)\.name$/,
    );

    if (skillsItemMatch) {
      const catIndex = Number(skillsItemMatch[1]);
      const itemIndex = Number(skillsItemMatch[2]);
      const category = draft.skills[catIndex];
      const item = category?.items[itemIndex];

      if (!category || !item) {
        return null;
      }

      return (
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Skill Name"
            value={item.name}
            onChange={(event) => {
              const nextItems = replaceItemAtIndex(category.items, itemIndex, {
                ...item,
                name: event.target.value,
              });
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, catIndex, {
                  ...category,
                  items: nextItems,
                }),
              }));
            }}
          />
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5 }}>
              Proficiency: {item.proficiency}%
            </Typography>
            <Slider
              size="small"
              value={item.proficiency}
              min={0}
              max={100}
              step={5}
              onChange={(_, value) => {
                const nextItems = replaceItemAtIndex(
                  category.items,
                  itemIndex,
                  {
                    ...item,
                    proficiency: value as number,
                  },
                );
                setDraft((current) => ({
                  ...current,
                  skills: replaceItemAtIndex(current.skills, catIndex, {
                    ...category,
                    items: nextItems,
                  }),
                }));
              }}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
              Icon
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {ICON_NAMES.map((key) => {
                const Ic = ICON_MAP[key];
                return (
                  <IconButton
                    key={key}
                    size="small"
                    onClick={() => {
                      const nextItems = replaceItemAtIndex(
                        category.items,
                        itemIndex,
                        {
                          ...item,
                          icon: key,
                        },
                      );
                      setDraft((current) => ({
                        ...current,
                        skills: replaceItemAtIndex(current.skills, catIndex, {
                          ...category,
                          items: nextItems,
                        }),
                      }));
                    }}
                    sx={{
                      border:
                        item.icon === key
                          ? "2px solid"
                          : "1px solid transparent",
                      borderColor:
                        item.icon === key ? "primary.main" : "transparent",
                      borderRadius: 1,
                    }}
                    title={key}
                  >
                    <Ic fontSize="small" />
                  </IconButton>
                );
              })}
            </Box>
          </Box>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              const nextItems = category.items.filter(
                (_, i) => i !== itemIndex,
              );
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, catIndex, {
                  ...category,
                  items: nextItems,
                }),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Delete Skill
          </Button>
        </Stack>
      );
    }

    // --- skills.N.N.icon ---
    const skillsItemIconMatch = selectedInlineFieldId.match(
      /^skills\.(\d+)\.(\d+)\.icon$/,
    );

    if (skillsItemIconMatch) {
      const catIndex = Number(skillsItemIconMatch[1]);
      const itemIndex = Number(skillsItemIconMatch[2]);
      const category = draft.skills[catIndex];
      const item = category?.items[itemIndex];

      if (!category || !item) return null;

      return (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {getInlineFieldLabel(selectedInlineFieldId)}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {ICON_NAMES.map((key) => {
              const Ic = ICON_MAP[key];
              return (
                <IconButton
                  key={key}
                  size="small"
                  onClick={() => {
                    const nextItems = replaceItemAtIndex(
                      category.items,
                      itemIndex,
                      {
                        ...item,
                        icon: key,
                      },
                    );
                    setDraft((current) => ({
                      ...current,
                      skills: replaceItemAtIndex(current.skills, catIndex, {
                        ...category,
                        items: nextItems,
                      }),
                    }));
                  }}
                  sx={{
                    border:
                      item.icon === key ? "2px solid" : "1px solid transparent",
                    borderColor:
                      item.icon === key ? "primary.main" : "transparent",
                    borderRadius: 1,
                  }}
                  title={key}
                >
                  <Ic fontSize="small" />
                </IconButton>
              );
            })}
          </Box>
        </Stack>
      );
    }

    // --- skills.N.N.proficiency ---
    const skillsItemProficiencyMatch = selectedInlineFieldId.match(
      /^skills\.(\d+)\.(\d+)\.proficiency$/,
    );

    if (skillsItemProficiencyMatch) {
      const catIndex = Number(skillsItemProficiencyMatch[1]);
      const itemIndex = Number(skillsItemProficiencyMatch[2]);
      const category = draft.skills[catIndex];
      const item = category?.items[itemIndex];

      if (!category || !item) return null;

      return (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Proficiency: {item.proficiency}%
          </Typography>
          <Slider
            size="small"
            value={item.proficiency}
            min={0}
            max={100}
            step={5}
            onChange={(_, value) => {
              const nextItems = replaceItemAtIndex(category.items, itemIndex, {
                ...item,
                proficiency: value as number,
              });
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, catIndex, {
                  ...category,
                  items: nextItems,
                }),
              }));
            }}
          />
        </Stack>
      );
    }

    const certificationMatch = selectedInlineFieldId.match(
      /^certifications\.(\d+)\.(name|issuer|year)$/,
    );

    if (certificationMatch) {
      const index = Number(certificationMatch[1]);
      const key = certificationMatch[2] as keyof CertificationItem;
      const item = draft.certifications[index];

      if (!item) {
        return null;
      }

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={getInlineFieldLabel(selectedInlineFieldId)}
          value={String(item[key] ?? "")}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              certifications: replaceItemAtIndex(
                current.certifications,
                index,
                {
                  ...item,
                  [key]: event.target.value,
                },
              ),
            }))
          }
        />
      );
    }

    return null;
  };

  const renderInlineToolbox = () => {
    if (!selectedPreviewSection) {
      return null;
    }

    if (
      selectedPreviewSection === "about" ||
      selectedPreviewSection === "contact"
    ) {
      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Name"
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
            size="small"
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
            size="small"
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
        </Stack>
      );
    }

    if (
      selectedPreviewSection === "skills" ||
      selectedPreviewSection === "services"
    ) {
      const firstCategory = draft.skills[0];

      if (!firstCategory) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                skills: [createEmptySkillCategory()],
              }))
            }
          >
            Add first skill category
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Category"
            value={firstCategory.category}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                skills: replaceItemAtIndex(current.skills, 0, {
                  ...firstCategory,
                  category: event.target.value,
                }),
              }))
            }
          />
        </Stack>
      );
    }

    if (selectedPreviewSection === "experience") {
      const firstItem = draft.experience[0];

      if (!firstItem) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                experience: [createEmptyExperienceItem(current.experience)],
              }))
            }
          >
            Add first experience
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Company"
            value={firstItem.company}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, 0, {
                  ...firstItem,
                  company: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Position"
            value={firstItem.position}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, 0, {
                  ...firstItem,
                  position: event.target.value,
                }),
              }))
            }
          />
        </Stack>
      );
    }

    if (selectedPreviewSection === "projects") {
      const firstItem = draft.projects[0];

      if (!firstItem) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                projects: [createEmptyProjectItem(current.projects)],
              }))
            }
          >
            Add first project
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Project name"
            value={firstItem.name}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, 0, {
                  ...firstItem,
                  name: event.target.value,
                }),
              }))
            }
          />
        </Stack>
      );
    }

    if (selectedPreviewSection === "portfolio") {
      const firstItem = draft.portfolio[0];

      if (!firstItem) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                portfolio: [createEmptyPortfolioItem(current.portfolio)],
              }))
            }
          >
            Add first portfolio item
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Portfolio title"
            value={firstItem.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, 0, {
                  ...firstItem,
                  title: event.target.value,
                }),
              }))
            }
          />
        </Stack>
      );
    }

    if (selectedPreviewSection === "education") {
      const firstItem = draft.education[0];

      if (!firstItem) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                education: [createEmptyEducationItem(current.education)],
              }))
            }
          >
            Add first education
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="School"
            value={firstItem.school}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                education: replaceItemAtIndex(current.education, 0, {
                  ...firstItem,
                  school: event.target.value,
                }),
              }))
            }
          />
        </Stack>
      );
    }

    if (selectedPreviewSection === "certifications") {
      const firstItem = draft.certifications[0];

      if (!firstItem) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                certifications: [
                  createEmptyCertificationItem(current.certifications),
                ],
              }))
            }
          >
            Add first certification
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Certification"
            value={firstItem.name}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                certifications: replaceItemAtIndex(current.certifications, 0, {
                  ...firstItem,
                  name: event.target.value,
                }),
              }))
            }
          />
        </Stack>
      );
    }

    return null;
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
              {/* Unsaved changes indicator */}
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
                disabled={hasUnsavedChanges}
                onClick={handlePreviewClick}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Preview
              </Button>
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
        </Stack>
      </Box>

      <Box>
        <ResumePage
          resume={draft}
          position="static"
          interactiveSections
          activeSectionId={selectedPreviewSection}
          onSectionClick={handlePreviewSectionClick}
          activeInlineFieldId={selectedInlineFieldId}
          onInlineFieldClick={handleInlineFieldClick}
          onAddAction={handleAddAction}
        />
      </Box>

      <Popover
        open={Boolean(anchorEl) && Boolean(selectedInlineFieldId)}
        anchorEl={anchorEl}
        onClose={handleCloseInlineEditor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              p: 2.5,
              minWidth: 300,
              maxWidth: 520,
              maxHeight: "70vh",
              overflowY: "auto",
              borderRadius: 3,
              border: "2px solid",
              borderColor: isDarkMode
                ? "rgba(20, 184, 166, 0.5)"
                : "rgba(15, 118, 110, 0.35)",
              backgroundColor: isDarkMode
                ? "rgba(15, 23, 42, 0.97)"
                : "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(12px)",
              boxShadow: isDarkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.5)"
                : "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
          },
        }}
      >
        {selectedInlineFieldId && (
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {getInlineFieldLabel(selectedInlineFieldId)}
              </Typography>
              <Chip
                size="small"
                label="Editing"
                color="primary"
                variant="filled"
              />
            </Stack>
            {renderInlineFieldToolbox()}
          </Stack>
        )}
      </Popover>

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
