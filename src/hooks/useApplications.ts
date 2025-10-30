import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteApplication,
  fetchAllApplications,
  fetchApplication,
  updateApplication,
  uploadApplications,
} from "@/lib/applications";
import { ApplicationStatus, CompanyApplication, CompanyApplicationWithId } from "@/type/applicationType";

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


type UpdateApplicationVariables = {
  applicationId: number;
  changedApplication: CompanyApplication; 
  queryKey?: (string | number)[]; 
  newStatus?: string;
};

// 상태 업데이트 훅
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateApplicationVariables) => {
      const { applicationId, changedApplication } = variables;
      return updateApplication({ applicationId, changedApplication });
    },

    onMutate: async (variables: UpdateApplicationVariables) => {
      const { applicationId, queryKey, newStatus } = variables;
      
      const context: { 
        previousListData?: unknown; 
        queryKey?: (string | number)[];
        previousSingleData?: unknown;
        singleAppQueryKey: (string | number)[];
      } = {
        singleAppQueryKey: ["application", applicationId]
      };

      await queryClient.cancelQueries({ queryKey: context.singleAppQueryKey });
      context.previousSingleData = queryClient.getQueryData(context.singleAppQueryKey);
      queryClient.setQueryData(context.singleAppQueryKey, (oldData: any) => {
         if (!oldData) return oldData;
         return { 
           ...oldData, 
           data: { ...oldData.data, data: variables.changedApplication }
         };
      });

      if (queryKey && newStatus) {
        await queryClient.cancelQueries({ queryKey });
        context.previousListData = queryClient.getQueryData(queryKey);
        context.queryKey = queryKey;

        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return oldData;
          const updatedContent = oldData.data.content.map(
            (item: CompanyApplicationWithId) =>
              item.id === applicationId ? { ...item, status: newStatus } : item
          );
          return { ...oldData, data: { ...oldData.data, content: updatedContent }};
        });
      }
      
      return context;
    },

    onError: (err, variables, context: any) => {
      alert("오류가 발생하였습니다.");
      if (context?.previousSingleData) {
        queryClient.setQueryData(context.singleAppQueryKey, context.previousSingleData);
      }
      if (context?.previousListData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousListData);
      }
    },

    onSettled: (data, error, variables, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
