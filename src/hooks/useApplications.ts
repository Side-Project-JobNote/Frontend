import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteApplication,
  fetchAllApplications,
  fetchApplication,
  updateApplication,
  uploadApplications,
} from "@/lib/applications";

// 업로드
export const useUploadApplications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadApplications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => {
      console.error("지원서 업로드 실패:", err);
    },
  });
};

// 전체 가져오기
export const useFetchAllApplications = (page: number, searchQuery: string) => {
  return useQuery({
    queryKey: ["applications", page, searchQuery],
    queryFn: () => fetchAllApplications(page),
    placeholderData: keepPreviousData,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
// 단일 가져오기
export const useFetchApplication = (applicationId: number) => {
  return useQuery({
    queryKey: ["application"],
    queryFn: () => fetchApplication(applicationId),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 상태 업데이트
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

// 삭제
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
