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
  TestimonialItem,
} from "@/types/resume";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { ICON_MAP, ICON_NAMES } from "@/components/resume/ServicesSection";
import { TECH_ICON_OPTIONS } from "@/components/resume/constants/techIcons";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  loadResumeDataSuccess,
  markAsSaved,
  clearResumeData,
  resetToBaseline as reduxResetToBaseline,
  discardChanges as reduxDiscardChanges,
} from "@/store/slices/resumeDataSlice";
import { useResumeEditor } from "@/hook/useResumeEditor";
import {
  clampProficiency,
  cloneResumeData,
  createEmptyCertificationItem,
  createEmptyEducationItem,
  createEmptyExperienceItem,
  createEmptyPortfolioItem,
  createEmptyProjectItem,
  createEmptyServiceCard,
  createEmptyServiceItem,
  createEmptySkillCategory,
  createEmptySkillItem,
  createEmptyTestimonialItem,
  csvToText,
  linesToText,
  removeItemAtIndex,
  replaceItemAtIndex,
  textToCsv,
  textToLines,
} from "./utils/util";
import {
  getInlineFieldLabel,
  renderIconMapPickerGrid,
} from "./utils/componentUtil";
import {
  EDITOR_SECTIONS,
  InlineEditableFieldId,
  PREVIEW_SECTION_TO_EDITOR_SECTION,
  SIMPLE_TEXT_FIELD_CONFIG,
} from "./constants/constant";
import { CustomPopover } from "../component/CustomPopover";
import { EditorProvider } from "@/context/EditorContext";

export type EditorSection = (typeof EDITOR_SECTIONS)[number]["value"];

// Quick-select presets for the "Add social link" flow — covers the most
// common platforms using icons already available in ICON_MAP, so picking one
// pre-fills label/icon/URL prefix while still allowing a fully custom entry.
const SOCIAL_LINK_PRESETS: Array<{
  label: string;
  icon: string;
  urlPrefix: string;
}> = [
  { label: "Facebook", icon: "facebook", urlPrefix: "https://facebook.com/" },
  {
    label: "LinkedIn",
    icon: "linkedin",
    urlPrefix: "https://linkedin.com/in/",
  },
  {
    label: "Instagram",
    icon: "instagram",
    urlPrefix: "https://instagram.com/",
  },
  { label: "Twitter / X", icon: "twitter", urlPrefix: "https://x.com/" },
];

// Role/category keyword -> suggested TECH_ICON_OPTIONS keys, used to surface
// a "Suggested" chip row above the full icon grid when adding/editing a
// service card's skill icon. Matched by substring against the card's
// (lowercased) title, e.g. "Backend Developer" matches "backend". Keep small
// and only reference keys that actually exist in TECH_ICON_OPTIONS.
const ROLE_ICON_SUGGESTIONS: Record<string, string[]> = {
  backend: [
    "nodejs",
    "express",
    "java",
    "spring",
    "python",
    "django",
    "flask",
    "go",
    "rust",
    "csharp",
    "php",
    "laravel",
    "ruby",
    "rails",
    "graphql",
  ],
  frontend: [
    "html5",
    "css3",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "redux",
    "vue",
    "angular",
    "tailwind",
    "bootstrap",
    "sass",
    "jquery",
  ],
  devops: [
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "vercel",
    "git",
    "github",
    "gitlab",
    "linux",
  ],
  database: [
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "sqlite",
    "graphql",
    "firebase",
  ],
  mobile: [
    "swift",
    "kotlin",
    "react",
    "typescript",
    "javascript",
    "firebase",
  ],
  design: ["figma", "css3", "html5", "sass", "tailwind", "bootstrap"],
};

interface SecretResumeEditorProps {
  initialResume: ResumeData;
}

export interface IEditorInterface {
  isEditMode?: boolean;
  activeSectionId?: ResumeEditableSection | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId | string,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: InlineEditableFieldId | string | null;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
}

export type IEditorInlineFieldSxProps = Omit<
  IEditorInterface,
  "activeSectionId"
> & {
  fieldId: InlineEditableFieldId;
};

export type IEditorFieldAndSectionProps = Omit<
  IEditorInlineFieldSxProps,
  "activeInlineFieldId" | "onAddAction"
> & {
  sectionId: ResumeEditableSection;
  fieldId: InlineEditableFieldId;
};

export interface IEditorCreateInlineFieldProps {
  sectionId: ResumeEditableSection;
  fieldId: InlineEditableFieldId;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
}

export type OnSectionClick = (section: ResumeEditableSection) => void;

export type OnInlineFieldClickHandler = (
  section: ResumeEditableSection,
  fieldId: InlineEditableFieldId,
  anchor?: HTMLElement,
) => void;

export interface IEditorProps {
  editorProps?: {
    // section & field

    // Field level interactions
    onInlineFieldClick?: OnInlineFieldClickHandler;
    activeInlineFieldId?: InlineEditableFieldId | null;

    // Section level interactions
    onSectionClick?: OnSectionClick;
    activeSectionId?: ResumeEditableSection | null;

    // Action
    onAddAction?: (action: string, anchor: HTMLElement) => void;
    onDeleteAction?: (action: string) => void;
    isEditMode?: boolean;
    onDelete?: () => void;
  };
}

const SecretResumeEditor = ({ initialResume }: SecretResumeEditorProps) => {
  const router = useRouter();
  const mainDispatch = useDispatch();
  const { isDarkMode } = useThemeContext();
  const [isHydrated, setIsHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use the resume editor hook for all draft management
  const { draft, hasDraft, setDraft, hasChanges } = useResumeEditor();
  const hasUnsavedChanges = hasChanges;

  const [activeSection, setActiveSection] =
    useState<EditorSection>("personalInfo");

  const [selectedPreviewSection, setSelectedPreviewSection] =
    useState<ResumeEditableSection | null>(null);

  const [selectedInlineFieldId, setSelectedInlineFieldId] =
    useState<InlineEditableFieldId | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (hasDraft) {
      setIsHydrated(true);
      return;
    }

    mainDispatch(loadResumeDataSuccess(initialResume));
  }, [hasDraft, initialResume, mainDispatch]);

  const updateStatsField = (field: keyof ResumeStats, value: string) => {
    setDraft((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [field]: Number(value) || 0,
      },
    }));
  };
  // TODO: We need to create a handler for holding the new value and default value

  // TODO: This will save on the session Storage
  const handleSaveDraft = () => {
    mainDispatch(markAsSaved());
    setNotice("Draft saved.");
  };

  const handleDiscardChangesClick = () => {
    mainDispatch(reduxDiscardChanges(cloneResumeData(initialResume)));
    setNotice("Unsaved changes discarded.");
  };

  const handleResetToBaselineClick = () => {
    mainDispatch(reduxResetToBaseline(cloneResumeData(initialResume)));
    setNotice("Draft reset to the static resume baseline.");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await signOut({
        callbackUrl: "/secret/login",
        redirect: false,
      });

      mainDispatch(clearResumeData());
      router.replace(result.url || "/secret/login");
      router.refresh();
    } catch {
      mainDispatch(clearResumeData());
      router.replace("/secret/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handlePreviewClick = () => {
    setSelectedPreviewSection(null);
    setSelectedInlineFieldId(null);

    router.replace("/cv");
    router.refresh();
  };

  const handlePreviewSectionClick = useCallback(
    (section: ResumeEditableSection) => {
      setSelectedPreviewSection(section);
      setSelectedInlineFieldId(null);
      setActiveSection(PREVIEW_SECTION_TO_EDITOR_SECTION[section]);
    },
    [],
  );

  const handleInlineFieldClick = useCallback(
    (
      section: ResumeEditableSection,
      fieldId: InlineEditableFieldId,
      anchor?: HTMLElement,
    ) => {
      setSelectedPreviewSection(section);
      setSelectedInlineFieldId(fieldId);
      setAnchorEl(anchor ?? null);
    },
    [],
  );

  const handleCloseInlineEditor = () => {
    setAnchorEl(null);
    setSelectedInlineFieldId(null);
  };

  const handleAddAction = useCallback((action: string, anchor: HTMLElement) => {
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
        setDraft((current) => {
          const currentItem = current.experience[expIndex];
          if (!currentItem) {
            return current;
          }

          return {
            ...current,
            experience: replaceItemAtIndex(current.experience, expIndex, {
              ...currentItem,
              description: [...currentItem.description, ""],
            }),
          };
        });
        const bulletIndex = item.description.length;
        const fieldId =
          `experience.${expIndex}.description.${bulletIndex}` as InlineEditableFieldId;
        handleInlineFieldClick("experience", fieldId, anchor);
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
        services: [
          ...current.services,
          createEmptyServiceCard(current.services),
        ],
      }));
      setNotice("New service card added.");
      return;
    }

    const serviceItemMatch = action.match(/^services\.(\d+)\.item$/);
    if (serviceItemMatch) {
      const cardIndex = Number(serviceItemMatch[1]);
      const card = draft.services[cardIndex];
      if (card) {
        const newItemIndex = card.items.length;
        setDraft((current) => {
          const currentCard = current.services[cardIndex];
          if (!currentCard) {
            return current;
          }

          return {
            ...current,
            services: replaceItemAtIndex(current.services, cardIndex, {
              ...currentCard,
              items: [
                ...currentCard.items,
                createEmptyServiceItem(currentCard.items),
              ],
            }),
          };
        });
        const fieldId =
          `services.${cardIndex}.${newItemIndex}.name` as InlineEditableFieldId;
        handleInlineFieldClick("services", fieldId, anchor);
      }
      return;
    }

    const skillItemMatch = action.match(/^skills\.(\d+)\.item$/);
    if (skillItemMatch) {
      const catIndex = Number(skillItemMatch[1]);
      const category = draft.skills[catIndex];
      if (category) {
        const newItemIndex = category.items.length;
        setDraft((current) => {
          // Read the category fresh from `current` (not the outer `category`
          // closure) so a rename that hasn't propagated back into `draft` yet
          // isn't silently reverted by this merge.
          const currentCategory = current.skills[catIndex];
          if (!currentCategory) {
            return current;
          }

          return {
            ...current,
            skills: replaceItemAtIndex(current.skills, catIndex, {
              ...currentCategory,
              items: [...currentCategory.items, createEmptySkillItem()],
            }),
          };
        });
        const fieldId =
          `skills.${catIndex}.${newItemIndex}.name` as InlineEditableFieldId;
        handleInlineFieldClick("skills", fieldId, anchor);
      }
      return;
    }

    if (action === "social") {
      const socialLinks = draft.personalInfo.social ?? [];
      const newIndex = socialLinks.length;
      const nextSocial = [...socialLinks, { label: "", url: "" }];
      setDraft((current) => ({
        ...current,
        personalInfo: { ...current.personalInfo, social: nextSocial },
      }));
      const fieldId =
        `personalInfo.social.${newIndex}` as InlineEditableFieldId;
      handleInlineFieldClick("about", fieldId, anchor);
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
      handleInlineFieldClick("about", fieldId, anchor);
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

    if (action === "testimonials") {
      setDraft((current) => ({
        ...current,
        testimonials: [
          ...current.testimonials,
          createEmptyTestimonialItem(current.testimonials),
        ],
      }));
      setNotice("New testimonial added.");
      return;
    }

    const portfolioResultMatch = action.match(/^portfolio\.(\d+)\.result$/);
    if (portfolioResultMatch) {
      const portIndex = Number(portfolioResultMatch[1]);
      const item = draft.portfolio[portIndex];
      if (item) {
        setDraft((current) => {
          const currentItem = current.portfolio[portIndex];
          if (!currentItem) {
            return current;
          }

          return {
            ...current,
            portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
              ...currentItem,
              results: [...currentItem.results, ""],
            }),
          };
        });
        const resultIndex = item.results.length;
        const fieldId =
          `portfolio.${portIndex}.result.${resultIndex}` as InlineEditableFieldId;
        handleInlineFieldClick("portfolio", fieldId, anchor);
      }
      return;
    }

    const portfolioTechMatch = action.match(/^portfolio\.(\d+)\.tech$/);
    if (portfolioTechMatch) {
      const portIndex = Number(portfolioTechMatch[1]);
      const item = draft.portfolio[portIndex];
      if (item) {
        const newTechIndex = item.technologies.length;
        setDraft((current) => {
          const currentItem = current.portfolio[portIndex];
          if (!currentItem) {
            return current;
          }

          return {
            ...current,
            portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
              ...currentItem,
              technologies: [...currentItem.technologies, ""],
            }),
          };
        });
        const fieldId =
          `portfolio.${portIndex}.technologies.${newTechIndex}` as InlineEditableFieldId;
        handleInlineFieldClick("portfolio", fieldId, anchor);
      }
      return;
    }

    const projectTechMatch = action.match(/^projects\.(\d+)\.tech$/);
    if (projectTechMatch) {
      const projIndex = Number(projectTechMatch[1]);
      const item = draft.projects[projIndex];
      if (item) {
        const newTechIndex = item.technologies.length;
        setDraft((current) => {
          const currentItem = current.projects[projIndex];
          if (!currentItem) {
            return current;
          }

          return {
            ...current,
            projects: replaceItemAtIndex(current.projects, projIndex, {
              ...currentItem,
              technologies: [...currentItem.technologies, ""],
            }),
          };
        });
        const fieldId =
          `projects.${projIndex}.technologies.${newTechIndex}` as InlineEditableFieldId;
        handleInlineFieldClick("projects", fieldId, anchor);
      }
      return;
    }
  }, [draft, setDraft, handleInlineFieldClick]);

  const handleDeleteAction = useCallback((action: string) => {
    const projectMatch = action.match(/^projects\.(\d+)$/);
    if (projectMatch) {
      const index = Number(projectMatch[1]);
      setDraft((current) => ({
        ...current,
        projects: removeItemAtIndex(current.projects, index),
      }));
      setNotice("Project removed.");
      return;
    }

    const portfolioMatch = action.match(/^portfolio\.(\d+)$/);
    if (portfolioMatch) {
      const index = Number(portfolioMatch[1]);
      setDraft((current) => ({
        ...current,
        portfolio: removeItemAtIndex(current.portfolio, index),
      }));
      setNotice("Portfolio item removed.");
      return;
    }

    const experienceMatch = action.match(/^experience\.(\d+)$/);
    if (experienceMatch) {
      const index = Number(experienceMatch[1]);
      setDraft((current) => ({
        ...current,
        experience: removeItemAtIndex(current.experience, index),
      }));
      setNotice("Experience removed.");
      return;
    }

    const educationMatch = action.match(/^education\.(\d+)$/);
    if (educationMatch) {
      const index = Number(educationMatch[1]);
      setDraft((current) => ({
        ...current,
        education: removeItemAtIndex(current.education, index),
      }));
      setNotice("Education removed.");
      return;
    }

    const certificationMatch = action.match(/^certifications\.(\d+)$/);
    if (certificationMatch) {
      const index = Number(certificationMatch[1]);
      setDraft((current) => ({
        ...current,
        certifications: removeItemAtIndex(current.certifications, index),
      }));
      setNotice("Certification removed.");
      return;
    }

    const testimonialMatch = action.match(/^testimonials\.(\d+)$/);
    if (testimonialMatch) {
      const index = Number(testimonialMatch[1]);
      setDraft((current) => ({
        ...current,
        testimonials: removeItemAtIndex(current.testimonials, index),
      }));
      setNotice("Testimonial removed.");
      return;
    }

    const serviceCardMatch = action.match(/^services\.(\d+)$/);
    if (serviceCardMatch) {
      const index = Number(serviceCardMatch[1]);
      setDraft((current) => ({
        ...current,
        services: removeItemAtIndex(current.services, index),
      }));
      setNotice("Service card removed.");
      return;
    }
  }, [setDraft]);

  // Shared icon picker for a service card's skill item — used by both the
  // services.N.N.name (comprehensive form) and services.N.N.icon branches so
  // the two stay in sync. Renders an optional "Suggested" chip row (based on
  // the parent card's title matching ROLE_ICON_SUGGESTIONS) above the full
  // TECH_ICON_OPTIONS grid. Any icon already used by another skill item
  // anywhere in draft.services is disabled/dimmed, mirroring the social-link
  // picker's duplicate-prevention pattern.
  const renderServiceItemIconPicker = (
    cardIndex: number,
    itemIndex: number,
  ) => {
    const card = draft.services[cardIndex];
    const item = card?.items[itemIndex];
    if (!card || !item) return null;

    const applyIcon = (key: string) => {
      const nextItems = replaceItemAtIndex(card.items, itemIndex, {
        ...item,
        icon: key,
      });
      setDraft((current) => ({
        ...current,
        services: replaceItemAtIndex(current.services, cardIndex, {
          ...card,
          items: nextItems,
        }),
      }));
    };

    // Icon keys already used by any skill item on any card, excluding the
    // item currently being edited, checked case-insensitively so the same
    // icon can't be assigned to two different skills across the section.
    const usedServiceIconKeys = new Set(
      draft.services.flatMap((c, cIdx) =>
        c.items
          .filter(
            (_it, iIdx) => !(cIdx === cardIndex && iIdx === itemIndex),
          )
          .map((it) => it.icon?.toLowerCase())
          .filter((icon): icon is string => Boolean(icon)),
      ),
    );

    const cardTitle = (card.title ?? "").toLowerCase();
    const matchedRoleKey = Object.keys(ROLE_ICON_SUGGESTIONS).find(
      (roleKeyword) => cardTitle.includes(roleKeyword),
    );
    const suggestedKeys = matchedRoleKey
      ? ROLE_ICON_SUGGESTIONS[matchedRoleKey].filter(
          (key) => !usedServiceIconKeys.has(key.toLowerCase()),
        )
      : [];
    const suggestedOptions = suggestedKeys
      .map((key) => TECH_ICON_OPTIONS.find((option) => option.key === key))
      .filter((option): option is (typeof TECH_ICON_OPTIONS)[number] =>
        Boolean(option),
      );

    return (
      <Stack spacing={1}>
        {suggestedOptions.length > 0 && (
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Suggested
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {suggestedOptions.map(({ key, label, Icon: Ic }) => (
                <Chip
                  key={key}
                  size="small"
                  clickable
                  icon={<Ic size={16} />}
                  label={label}
                  onClick={() => applyIcon(key)}
                />
              ))}
            </Stack>
          </Stack>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {TECH_ICON_OPTIONS.map(({ key, label, Icon: Ic }) => {
            const isSelected = item.icon === key;
            const isUsedElsewhere =
              !isSelected && usedServiceIconKeys.has(key.toLowerCase());
            return (
              <IconButton
                key={key}
                size="small"
                disabled={isUsedElsewhere}
                onClick={() => {
                  if (isUsedElsewhere) return;
                  applyIcon(key);
                }}
                sx={{
                  border: isSelected ? "2px solid" : "1px solid transparent",
                  borderColor: isSelected ? "primary.main" : "transparent",
                  borderRadius: 1,
                  opacity: isUsedElsewhere ? 0.35 : 1,
                }}
                title={
                  isUsedElsewhere
                    ? `${label} — already used by another skill`
                    : label
                }
              >
                <Ic size={18} />
              </IconButton>
            );
          })}
        </Box>
      </Stack>
    );
  };

  const renderInlineFieldToolbox = () => {
    if (!selectedInlineFieldId) {
      return null;
    }

    if (selectedInlineFieldId.startsWith("personalInfo.")) {
      // Handle social links — scoped to the single entry that was clicked,
      // not the whole list, so each entry edits independently.
      const socialMatch = selectedInlineFieldId.match(
        /^personalInfo\.social\.(\d+)$/,
      );

      if (socialMatch) {
        const idx = Number(socialMatch[1]);
        const socialInfo = draft.personalInfo.social ?? [];
        const s = socialInfo[idx];

        if (!s) {
          return null;
        }

        // Only offer quick presets while the entry is still blank — once the
        // user has typed a custom label/url, keep the toolbox focused on
        // editing rather than re-surfacing the preset row.
        const isBlankEntry = !s.label && !s.url;

        // Icon keys already used by *other* social entries — checked
        // case-insensitively against the live draft (saved + unsaved) so an
        // icon can't be assigned to two entries, whether picked via the
        // Quick add chips or the manual icon grid below.
        const usedIconKeys = new Set(
          socialInfo
            .filter((_entry, entryIdx) => entryIdx !== idx)
            .map((entry) => entry.icon?.toLowerCase())
            .filter((icon): icon is string => Boolean(icon)),
        );

        // Hide presets that are already present among the existing social
        // entries (matched by icon key, falling back to label) so the same
        // platform can't be quick-added twice.
        const availablePresets = SOCIAL_LINK_PRESETS.filter((preset) => {
          if (usedIconKeys.has(preset.icon.toLowerCase())) {
            return false;
          }
          const isAlreadyAddedByLabel = socialInfo.some((entry, entryIdx) => {
            if (entryIdx === idx || entry.icon) {
              return false;
            }
            return (
              (entry.label ?? "").trim().toLowerCase() ===
              preset.label.toLowerCase()
            );
          });
          return !isAlreadyAddedByLabel;
        });

        return (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {isBlankEntry && availablePresets.length > 0 && (
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Quick add
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {availablePresets.map((preset) => {
                    const PresetIcon = ICON_MAP[preset.icon];
                    return (
                      <Chip
                        key={preset.icon}
                        size="small"
                        clickable
                        icon={
                          PresetIcon ? (
                            <PresetIcon sx={{ fontSize: 16 }} />
                          ) : undefined
                        }
                        label={preset.label}
                        onClick={() => {
                          const next = [...socialInfo];
                          next[idx] = {
                            ...next[idx],
                            label: preset.label,
                            icon: preset.icon,
                            url: preset.urlPrefix,
                          };
                          setDraft((current) => ({
                            ...current,
                            personalInfo: {
                              ...current.personalInfo,
                              social: next,
                            },
                          }));
                        }}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            )}
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
                value={s.url ?? ""}
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
                const isSelected = s.icon === iconKey;
                // An icon already used by another entry can't be reassigned
                // here either — otherwise this grid reintroduces the same
                // duplicate-icon bug the Quick add presets guard against.
                const isUsedElsewhere =
                  !isSelected && usedIconKeys.has(iconKey.toLowerCase());
                return (
                  <IconButton
                    key={iconKey}
                    size="small"
                    disabled={isUsedElsewhere}
                    title={
                      isUsedElsewhere
                        ? "Already used by another social link"
                        : undefined
                    }
                    onClick={() => {
                      if (isUsedElsewhere) {
                        return;
                      }
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
                      borderColor: isSelected ? "primary.main" : "divider",
                      backgroundColor: isSelected
                        ? "action.selected"
                        : "transparent",
                      borderRadius: 1,
                      opacity: isUsedElsewhere ? 0.35 : 1,
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </IconButton>
                );
              })}
            </Box>
            <Divider />
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
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
                handleCloseInlineEditor();
              }}
              sx={{ textTransform: "none" }}
            >
              Remove social link
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

    // Experience field clicked directly (e.g. clicking the "Sr. Software
    // Engineer" title) — scoped to ONLY that one field on that one entry,
    // mirroring the education.(idx).(school|degree|year|location) pattern
    // below. Previously this branch ignored which key was clicked and always
    // rendered the whole entry (position + company + duration + location +
    // all bullets), so clicking any single field on any entry opened the
    // same "everything" panel — the per-entry leak reported by the user.
    const experienceMatch = selectedInlineFieldId.match(
      /^experience\.(\d+)\.(company|position|duration|location)$/,
    );

    if (experienceMatch) {
      const index = Number(experienceMatch[1]);
      const key = experienceMatch[2] as
        | "company"
        | "position"
        | "duration"
        | "location";
      const item = draft.experience[index];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={getInlineFieldLabel(selectedInlineFieldId)}
            value={item[key]}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                experience: replaceItemAtIndex(current.experience, index, {
                  ...item,
                  [key]: event.target.value,
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

    // Project field clicked directly (e.g. clicking the project name, or its
    // image, or its tech list) — scoped to ONLY that one field on that one
    // entry, mirroring the experience.(idx).(company|position|...) pattern.
    // Previously this branch captured the clicked field key but ignored it
    // and always rendered every project field (name + description + image +
    // technologies + link + demoUrl + caseStudy) together.
    const projectMatch = selectedInlineFieldId.match(
      /^projects\.(\d+)\.(name|description|image|technologies|link|demoUrl|caseStudy)$/,
    );

    if (projectMatch) {
      const index = Number(projectMatch[1]);
      const key = projectMatch[2] as
        | "name"
        | "description"
        | "image"
        | "technologies"
        | "link"
        | "demoUrl"
        | "caseStudy";
      const item = draft.projects[index];

      if (!item) {
        return null;
      }

      const isMultiline = key === "description" || key === "caseStudy";
      const isTechnologies = key === "technologies";

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={getInlineFieldLabel(selectedInlineFieldId)}
            value={isTechnologies ? csvToText(item.technologies) : item[key]}
            multiline={isMultiline}
            minRows={isMultiline ? 3 : undefined}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, index, {
                  ...item,
                  [key]: isTechnologies
                    ? textToCsv(event.target.value)
                    : event.target.value,
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

    // Project technology tag clicked directly — scoped to ONLY that one
    // tag by index, mirroring the portfolio.(idx).technologies.(idx) "add
    // one, edit that one" pattern rather than editing the whole
    // technologies array as a single combined CSV field.
    const projectTechItemMatch = selectedInlineFieldId.match(
      /^projects\.(\d+)\.technologies\.(\d+)$/,
    );

    if (projectTechItemMatch) {
      const projIndex = Number(projectTechItemMatch[1]);
      const techIndex = Number(projectTechItemMatch[2]);
      const item = draft.projects[projIndex];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={`Tag #${techIndex + 1}`}
            value={item.technologies[techIndex] ?? ""}
            onChange={(event) => {
              const nextTechnologies = [...item.technologies];
              nextTechnologies[techIndex] = event.target.value;
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, projIndex, {
                  ...item,
                  technologies: nextTechnologies,
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
              const nextTechnologies = item.technologies.filter(
                (_, i) => i !== techIndex,
              );
              setDraft((current) => ({
                ...current,
                projects: replaceItemAtIndex(current.projects, projIndex, {
                  ...item,
                  technologies: nextTechnologies,
                }),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove tag
          </Button>
        </Stack>
      );
    }

    // Portfolio field clicked directly (e.g. clicking the item's title, tag,
    // image, or testimonial) — scoped to ONLY that one field on that one
    // entry, mirroring the experience.(idx).(company|position|...) pattern.
    // Previously this branch captured the clicked field key but ignored it
    // and always rendered every portfolio field (title + description +
    // longDescription + category + image + technologies + demoUrl +
    // githubUrl + results + testimonial + client) together.
    const portfolioMatch = selectedInlineFieldId.match(
      /^portfolio\.(\d+)\.(name|description|image|longDescription|category|technologies|demoUrl|githubUrl|testimonial|client)$/,
    );

    if (portfolioMatch) {
      const index = Number(portfolioMatch[1]);
      const key = portfolioMatch[2] as
        | "name"
        | "description"
        | "image"
        | "longDescription"
        | "category"
        | "technologies"
        | "demoUrl"
        | "githubUrl"
        | "testimonial"
        | "client";
      const item = draft.portfolio[index];

      if (!item) {
        return null;
      }

      // `name` maps to the item's `title` field; every other key matches the
      // portfolio item's own property name.
      const isTitle = key === "name";
      const isTechnologies = key === "technologies";
      const isMultiline =
        key === "description" || key === "longDescription" || key === "testimonial";

      const fieldValue = isTitle
        ? item.title
        : isTechnologies
          ? csvToText(item.technologies)
          : String(item[key as keyof typeof item] ?? "");

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={getInlineFieldLabel(selectedInlineFieldId)}
            value={fieldValue}
            multiline={isMultiline}
            minRows={isMultiline ? (key === "description" ? 2 : 3) : undefined}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, index, {
                  ...item,
                  ...(isTitle
                    ? { title: event.target.value }
                    : isTechnologies
                      ? { technologies: textToCsv(event.target.value) }
                      : { [key]: event.target.value }),
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

    // Portfolio technology tag clicked directly — scoped to ONLY that one
    // tag by index, mirroring the personalInfo.social.(idx) "add one, edit
    // that one" pattern rather than editing the whole technologies array as
    // a single combined CSV field.
    const portfolioTechItemMatch = selectedInlineFieldId.match(
      /^portfolio\.(\d+)\.technologies\.(\d+)$/,
    );

    if (portfolioTechItemMatch) {
      const portIndex = Number(portfolioTechItemMatch[1]);
      const techIndex = Number(portfolioTechItemMatch[2]);
      const item = draft.portfolio[portIndex];

      if (!item) {
        return null;
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label={`Tag #${techIndex + 1}`}
            value={item.technologies[techIndex] ?? ""}
            onChange={(event) => {
              const nextTechnologies = [...item.technologies];
              nextTechnologies[techIndex] = event.target.value;
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
                  ...item,
                  technologies: nextTechnologies,
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
              const nextTechnologies = item.technologies.filter(
                (_, i) => i !== techIndex,
              );
              setDraft((current) => ({
                ...current,
                portfolio: replaceItemAtIndex(current.portfolio, portIndex, {
                  ...item,
                  technologies: nextTechnologies,
                }),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Remove tag
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

    // --- Top-level "Badge"/"Title"/"Subtitle" single-string fields
    // (servicesBadge, servicesTitle, servicesSubtitle, experienceBadge,
    // experienceTitle, portfolioBadge, portfolioTitle, portfolioSubtitle,
    // projectsBadge, projectsTitle, projectsSubtitle) — all identical in
    // shape (one TextField, a label + placeholder, writes straight back to
    // draft.<field>), so they're driven from SIMPLE_TEXT_FIELD_CONFIG rather
    // than one near-identical `if` block per field.
    const simpleTextFieldConfig =
      SIMPLE_TEXT_FIELD_CONFIG[selectedInlineFieldId];
    if (simpleTextFieldConfig) {
      const { label, placeholder, field } = simpleTextFieldConfig;
      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={label}
          value={draft[field] ?? ""}
          placeholder={placeholder}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              [field]: event.target.value,
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
          {renderIconMapPickerGrid(category.icon, (key) =>
            setDraft((current) => ({
              ...current,
              skills: replaceItemAtIndex(current.skills, index, {
                ...category,
                icon: key,
              }),
            })),
          )}
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
            <Box sx={{ mt: 0.5 }}>
              {renderIconMapPickerGrid(category.icon, (key) =>
                setDraft((current) => ({
                  ...current,
                  skills: replaceItemAtIndex(current.skills, index, {
                    ...category,
                    icon: key,
                  }),
                })),
              )}
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
              Technology Icon
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {TECH_ICON_OPTIONS.map(({ key, label, Icon: Ic }) => {
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
                    title={label}
                  >
                    <Ic size={18} />
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
            {TECH_ICON_OPTIONS.map(({ key, label, Icon: Ic }) => {
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
                  title={label}
                >
                  <Ic size={18} />
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

    // --- services.N.icon (card icon) ---
    const servicesCardIconMatch = selectedInlineFieldId.match(
      /^services\.(\d+)\.icon$/,
    );

    if (servicesCardIconMatch) {
      const index = Number(servicesCardIconMatch[1]);
      const card = draft.services[index];

      if (!card) return null;

      return (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Service Card #{index + 1} Icon
          </Typography>
          {renderIconMapPickerGrid(card.icon, (key) =>
            setDraft((current) => ({
              ...current,
              services: replaceItemAtIndex(current.services, index, {
                ...card,
                icon: key,
              }),
            })),
          )}
        </Stack>
      );
    }

    // --- services.N.subtitle ---
    const servicesCardSubtitleMatch = selectedInlineFieldId.match(
      /^services\.(\d+)\.subtitle$/,
    );

    if (servicesCardSubtitleMatch) {
      const index = Number(servicesCardSubtitleMatch[1]);
      const card = draft.services[index];

      if (!card) return null;

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={`Service Card #${index + 1} Subtitle`}
          value={card.subtitle ?? ""}
          placeholder={`Expert ${card.title.toLowerCase()} solutions`}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              services: replaceItemAtIndex(current.services, index, {
                ...card,
                subtitle: event.target.value,
              }),
            }))
          }
        />
      );
    }

    // --- services.N.title (comprehensive card form) ---
    const servicesCardTitleMatch = selectedInlineFieldId.match(
      /^services\.(\d+)\.title$/,
    );

    if (servicesCardTitleMatch) {
      const index = Number(servicesCardTitleMatch[1]);
      const card = draft.services[index];

      if (!card) {
        return null;
      }

      return (
        <Stack spacing={2} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Card Title"
            value={card.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                services: replaceItemAtIndex(current.services, index, {
                  ...card,
                  title: event.target.value,
                }),
              }))
            }
          />
          <TextField
            size="small"
            label="Subtitle"
            value={card.subtitle ?? ""}
            placeholder={`Expert ${card.title.toLowerCase()} solutions`}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                services: replaceItemAtIndex(current.services, index, {
                  ...card,
                  subtitle: event.target.value,
                }),
              }))
            }
          />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
              Card Icon
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {renderIconMapPickerGrid(card.icon, (key) =>
                setDraft((current) => ({
                  ...current,
                  services: replaceItemAtIndex(current.services, index, {
                    ...card,
                    icon: key,
                  }),
                })),
              )}
            </Box>
          </Box>
          <Divider />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Skills ({card.items.length})
          </Typography>
          {card.items.map((item, itemIdx) => (
            <Stack
              key={item.id}
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
                  const nextItems = replaceItemAtIndex(card.items, itemIdx, {
                    ...item,
                    name: event.target.value,
                  });
                  setDraft((current) => ({
                    ...current,
                    services: replaceItemAtIndex(current.services, index, {
                      ...card,
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
                  const nextItems = replaceItemAtIndex(card.items, itemIdx, {
                    ...item,
                    proficiency: Math.min(
                      100,
                      Math.max(0, Number(event.target.value)),
                    ),
                  });
                  setDraft((current) => ({
                    ...current,
                    services: replaceItemAtIndex(current.services, index, {
                      ...card,
                      items: nextItems,
                    }),
                  }));
                }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  const nextItems = card.items.filter((_, i) => i !== itemIdx);
                  setDraft((current) => ({
                    ...current,
                    services: replaceItemAtIndex(current.services, index, {
                      ...card,
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
                services: replaceItemAtIndex(current.services, index, {
                  ...card,
                  items: [...card.items, createEmptyServiceItem(card.items)],
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
                services: current.services.filter((_, i) => i !== index),
              }));
              handleCloseInlineEditor();
            }}
            sx={{ textTransform: "none" }}
          >
            Delete Card
          </Button>
        </Stack>
      );
    }

    // --- services.N.N.name (comprehensive skill item form) ---
    const servicesItemMatch = selectedInlineFieldId.match(
      /^services\.(\d+)\.(\d+)\.name$/,
    );

    if (servicesItemMatch) {
      const cardIndex = Number(servicesItemMatch[1]);
      const itemIndex = Number(servicesItemMatch[2]);
      const card = draft.services[cardIndex];
      const item = card?.items[itemIndex];

      if (!card || !item) {
        return null;
      }

      return (
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Skill Name"
            value={item.name}
            onChange={(event) => {
              const nextItems = replaceItemAtIndex(card.items, itemIndex, {
                ...item,
                name: event.target.value,
              });
              setDraft((current) => ({
                ...current,
                services: replaceItemAtIndex(current.services, cardIndex, {
                  ...card,
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
                const nextItems = replaceItemAtIndex(card.items, itemIndex, {
                  ...item,
                  proficiency: value as number,
                });
                setDraft((current) => ({
                  ...current,
                  services: replaceItemAtIndex(current.services, cardIndex, {
                    ...card,
                    items: nextItems,
                  }),
                }));
              }}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
              Technology Icon
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {renderServiceItemIconPicker(cardIndex, itemIndex)}
            </Box>
          </Box>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              const nextItems = card.items.filter((_, i) => i !== itemIndex);
              setDraft((current) => ({
                ...current,
                services: replaceItemAtIndex(current.services, cardIndex, {
                  ...card,
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

    // --- services.N.N.icon ---
    const servicesItemIconMatch = selectedInlineFieldId.match(
      /^services\.(\d+)\.(\d+)\.icon$/,
    );

    if (servicesItemIconMatch) {
      const cardIndex = Number(servicesItemIconMatch[1]);
      const itemIndex = Number(servicesItemIconMatch[2]);
      const card = draft.services[cardIndex];
      const item = card?.items[itemIndex];

      if (!card || !item) return null;

      return (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Service Card #{cardIndex + 1} Item #{itemIndex + 1} Icon
          </Typography>
          {renderServiceItemIconPicker(cardIndex, itemIndex)}
        </Stack>
      );
    }

    // --- services.N.N.proficiency ---
    const servicesItemProficiencyMatch = selectedInlineFieldId.match(
      /^services\.(\d+)\.(\d+)\.proficiency$/,
    );

    if (servicesItemProficiencyMatch) {
      const cardIndex = Number(servicesItemProficiencyMatch[1]);
      const itemIndex = Number(servicesItemProficiencyMatch[2]);
      const card = draft.services[cardIndex];
      const item = card?.items[itemIndex];

      if (!card || !item) return null;

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
              const nextItems = replaceItemAtIndex(card.items, itemIndex, {
                ...item,
                proficiency: value as number,
              });
              setDraft((current) => ({
                ...current,
                services: replaceItemAtIndex(current.services, cardIndex, {
                  ...card,
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

    const testimonialMatch = selectedInlineFieldId.match(
      /^testimonials\.(\d+)\.(quote|authorName|authorRole|authorCompany|photoUrl)$/,
    );

    if (testimonialMatch) {
      const index = Number(testimonialMatch[1]);
      const key = testimonialMatch[2] as keyof TestimonialItem;
      const item = draft.testimonials[index];

      if (!item) {
        return null;
      }

      return (
        <TextField
          size="small"
          sx={{ mt: 1.5 }}
          label={getInlineFieldLabel(selectedInlineFieldId)}
          multiline={key === "quote"}
          minRows={key === "quote" ? 2 : undefined}
          value={String(item[key] ?? "")}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              testimonials: replaceItemAtIndex(current.testimonials, index, {
                ...item,
                [key]: event.target.value,
              }),
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

    if (selectedPreviewSection === "skills") {
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

    if (selectedPreviewSection === "services") {
      const firstCard = draft.services[0];

      if (!firstCard) {
        return (
          <Button
            sx={{ mt: 1.5, alignSelf: "flex-start", textTransform: "none" }}
            variant="outlined"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                services: [createEmptyServiceCard(current.services)],
              }))
            }
          >
            Add first service card
          </Button>
        );
      }

      return (
        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            label="Card Title"
            value={firstCard.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                services: replaceItemAtIndex(current.services, 0, {
                  ...firstCard,
                  title: event.target.value,
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
      case "testimonials":
        return (
          <Stack spacing={2.5}>
            {draft.testimonials.map((item, index) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Testimonial #{index + 1}
                      </Typography>
                      <IconButton
                        aria-label="Remove testimonial"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            testimonials: removeItemAtIndex(
                              current.testimonials,
                              index,
                            ),
                          }))
                        }
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Quote"
                      value={item.quote}
                      multiline
                      minRows={2}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          quote: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          testimonials: replaceItemAtIndex(
                            current.testimonials,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Author name"
                      value={item.authorName}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          authorName: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          testimonials: replaceItemAtIndex(
                            current.testimonials,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Author role"
                      value={item.authorRole}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          authorRole: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          testimonials: replaceItemAtIndex(
                            current.testimonials,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Author company (optional)"
                      value={item.authorCompany ?? ""}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          authorCompany: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          testimonials: replaceItemAtIndex(
                            current.testimonials,
                            index,
                            nextItem,
                          ),
                        }));
                      }}
                    />
                    <TextField
                      label="Photo URL (optional)"
                      value={item.photoUrl ?? ""}
                      onChange={(event) => {
                        const nextItem = {
                          ...item,
                          photoUrl: event.target.value,
                        };
                        setDraft((current) => ({
                          ...current,
                          testimonials: replaceItemAtIndex(
                            current.testimonials,
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
                  testimonials: [
                    ...current.testimonials,
                    createEmptyTestimonialItem(current.testimonials),
                  ],
                }))
              }
            >
              Add testimonial
            </Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  const editorProps = useMemo(
    () => ({
      isEditMode: true,
      onInlineFieldClick: handleInlineFieldClick,
      activeInlineFieldId: selectedInlineFieldId,
      onSectionClick: handlePreviewSectionClick,
      activeSection: selectedPreviewSection,
      onAddAction: handleAddAction,
      onDeleteAction: handleDeleteAction,
      onDelete: handleDeleteAction,
    }),
    [
      handleInlineFieldClick,
      selectedInlineFieldId,
      handlePreviewSectionClick,
      selectedPreviewSection,
      handleAddAction,
      handleDeleteAction,
    ],
  );

  if (!isHydrated || !hasDraft) {
    return <SecretEditorSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <EditorProvider value={editorProps}>
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
                  onClick={handleDiscardChangesClick}
                  disabled={!hasChanges}
                  sx={{ textTransform: "none" }}
                >
                  Discard changes
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<SettingsBackupRestoreIcon />}
                  onClick={handleResetToBaselineClick}
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
          <ResumePage resume={draft} position="static" />
        </Box>

        {/* Popover */}
        <CustomPopover
          anchorEl={anchorEl}
          selectedInlineFieldId={selectedInlineFieldId}
          handleCloseInlineEditor={handleCloseInlineEditor}
          getInlineFieldLabel={getInlineFieldLabel}
          renderInlineFieldToolbox={renderInlineFieldToolbox}
        />

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
    </EditorProvider>
  );
};

export default SecretResumeEditor;
