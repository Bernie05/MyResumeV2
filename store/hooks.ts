import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import type {
  ResumeData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  CertificationItem,
  ProjectItem,
  ServiceCard,
} from "@/types/resume";
import {
  loadResumeDataStart,
  loadResumeDataSuccess,
  loadResumeDataFailure,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  updateSkills,
  addSkillCategory,
  addServiceCard,
  updateServiceCard,
  deleteServiceCard,
  addServiceItem,
  updateServiceItem,
  deleteServiceItem,
  addCertification,
  updateCertification,
  deleteCertification,
  addProject,
  updateProject,
  deleteProject,
  markAsSaved,
} from "@/store/slices/resumeDataSlice";

// Base hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to access resume data from Redux store
 */
export const useResumeData = () => {
  return useSelector((state: RootState) => state.resumeData?.data);
};

/**
 * Hook to access resume loading state
 */
export const useResumeLoading = () => {
  return useSelector(
    (state: RootState) => state.resumeData?.isLoading ?? false,
  );
};

/**
 * Hook to access resume error state
 */
export const useResumeError = () => {
  return useSelector((state: RootState) => state.resumeData?.error ?? null);
};

/**
 * Hook to check if resume has unsaved changes
 */
export const useResumeHasChanges = () => {
  return useSelector(
    (state: RootState) => state.resumeData?.hasChanges ?? false,
  );
};

/**
 * Hook to get last saved timestamp
 */
export const useResumeLastSaved = () => {
  return useSelector((state: RootState) => state.resumeData?.lastSaved ?? null);
};

/**
 * Master hook for all resume operations
 */
export const useResumeOperations = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Data loading
  const loadResume = useCallback(
    (data: ResumeData) => {
      dispatch(loadResumeDataStart());
      try {
        dispatch(loadResumeDataSuccess(data));
      } catch (error) {
        dispatch(
          loadResumeDataFailure(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    },
    [dispatch],
  );

  // Personal info operations
  const updatePersonal = useCallback(
    (updates: Partial<PersonalInfo>) => {
      dispatch(updatePersonalInfo(updates));
    },
    [dispatch],
  );

  // Experience operations
  const addExp = useCallback(
    (experience: ExperienceItem) => {
      dispatch(addExperience(experience));
    },
    [dispatch],
  );

  const updateExp = useCallback(
    (id: number, updates: Partial<ExperienceItem>) => {
      dispatch(updateExperience({ id, updates }));
    },
    [dispatch],
  );

  const removeExp = useCallback(
    (id: number) => {
      dispatch(deleteExperience(id));
    },
    [dispatch],
  );

  // Education operations
  const addEdu = useCallback(
    (education: EducationItem) => {
      dispatch(addEducation(education));
    },
    [dispatch],
  );

  const updateEdu = useCallback(
    (id: number, updates: Partial<EducationItem>) => {
      dispatch(updateEducation({ id, updates }));
    },
    [dispatch],
  );

  const removeEdu = useCallback(
    (id: number) => {
      dispatch(deleteEducation(id));
    },
    [dispatch],
  );

  // Skills operations
  const updateAllSkills = useCallback(
    (skills: SkillCategory[]) => {
      dispatch(updateSkills(skills));
    },
    [dispatch],
  );

  const addSkills = useCallback(
    (skillCategory: SkillCategory) => {
      dispatch(addSkillCategory(skillCategory));
    },
    [dispatch],
  );

  // Services operations (independent entity from Skills)
  const addService = useCallback(
    (card: ServiceCard) => {
      dispatch(addServiceCard(card));
    },
    [dispatch],
  );

  const updateService = useCallback(
    (id: number, updates: Partial<ServiceCard>) => {
      dispatch(updateServiceCard({ id, updates }));
    },
    [dispatch],
  );

  const removeService = useCallback(
    (id: number) => {
      dispatch(deleteServiceCard(id));
    },
    [dispatch],
  );

  const addServiceCardItem = useCallback(
    (cardId: number, item: ServiceCard["items"][number]) => {
      dispatch(addServiceItem({ cardId, item }));
    },
    [dispatch],
  );

  const updateServiceCardItem = useCallback(
    (
      cardId: number,
      itemIndex: number,
      updates: Partial<ServiceCard["items"][number]>,
    ) => {
      dispatch(updateServiceItem({ cardId, itemIndex, updates }));
    },
    [dispatch],
  );

  const removeServiceCardItem = useCallback(
    (cardId: number, itemIndex: number) => {
      dispatch(deleteServiceItem({ cardId, itemIndex }));
    },
    [dispatch],
  );

  // Certifications operations
  const addCert = useCallback(
    (certification: CertificationItem) => {
      dispatch(addCertification(certification));
    },
    [dispatch],
  );

  const updateCert = useCallback(
    (id: number, updates: Partial<CertificationItem>) => {
      dispatch(updateCertification({ id, updates }));
    },
    [dispatch],
  );

  const removeCert = useCallback(
    (id: number) => {
      dispatch(deleteCertification(id));
    },
    [dispatch],
  );

  // Projects operations
  const addProj = useCallback(
    (project: ProjectItem) => {
      dispatch(addProject(project));
    },
    [dispatch],
  );

  const updateProj = useCallback(
    (id: number, updates: Partial<ProjectItem>) => {
      dispatch(updateProject({ id, updates }));
    },
    [dispatch],
  );

  const removeProj = useCallback(
    (id: number) => {
      dispatch(deleteProject(id));
    },
    [dispatch],
  );

  // Save operation
  const markSaved = useCallback(() => {
    dispatch(markAsSaved());
  }, [dispatch]);

  return {
    loadResume,
    updatePersonal,
    addExp,
    updateExp,
    removeExp,
    addEdu,
    updateEdu,
    removeEdu,
    updateAllSkills,
    addSkills,
    addService,
    updateService,
    removeService,
    addServiceCardItem,
    updateServiceCardItem,
    removeServiceCardItem,
    addCert,
    updateCert,
    removeCert,
    addProj,
    updateProj,
    removeProj,
    markSaved,
  };
};
