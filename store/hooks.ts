import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import type { ResumeData } from "@/types/resume";
import {
  loadResumeDataStart,
  loadResumeDataSuccess,
  loadResumeDataFailure,
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
      // Dispatching loadResumeDataStart before attempting to load data
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

  return {
    loadResume,
  };
};
