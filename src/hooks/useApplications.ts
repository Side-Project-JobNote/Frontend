import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteApplication,
  fetchAllApplications,
  fetchApplication,
  updateApplication,
  uploadApplications,
} from "@/lib/applications";
import { CompanyApplication, CompanyApplicationWithId } from "@/type/applicationType";

// 업로드
export const useUploadApplications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadApplications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: () => {
      console.error("지원서 업로드 실패:");
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

interface UpdateContext {
  previousListData?: {
    data: { content: CompanyApplicationWithId[] };
  };
  previousSingleData?: CompanyApplicationWithId;
  queryKey?: (string | number)[];
  singleAppQueryKey: (string | number)[];
}

// 상태 업데이트 훅
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    UpdateApplicationVariables,
    UpdateContext
  >({
    mutationFn: ({ applicationId, changedApplication }) =>
      updateApplication({ applicationId, changedApplication }),

    onMutate: async (variables) => {
      const { applicationId, queryKey, newStatus, changedApplication } = variables;

      const context: UpdateContext = {
        singleAppQueryKey: ["application", applicationId],
      };

      await queryClient.cancelQueries({ queryKey: context.singleAppQueryKey });
      const previousSingle = queryClient.getQueryData<CompanyApplicationWithId>(
        context.singleAppQueryKey
      );
      context.previousSingleData = previousSingle;

      if (previousSingle) {
        queryClient.setQueryData<CompanyApplicationWithId>(
          context.singleAppQueryKey,
          {
            ...previousSingle,
            ...changedApplication,
          }
        );
      }

      if (queryKey && newStatus) {
        await queryClient.cancelQueries({ queryKey });
        const previousList = queryClient.getQueryData<{
          data: { content: CompanyApplicationWithId[] };
        }>(queryKey);
        context.previousListData = previousList;
        context.queryKey = queryKey;

        if (previousList?.data?.content) {
          const updatedContent = previousList.data.content.map((item) =>
            item.id === applicationId ? { ...item, status: newStatus } : item
          );
          queryClient.setQueryData(queryKey, {
            ...previousList,
            data: { ...previousList.data, content: updatedContent },
          });
        }
      }

      return context;
    },

    onError: (_err, _variables, context) => {
      alert("오류가 발생하였습니다.");

      if (context?.previousSingleData) {
        queryClient.setQueryData(
          context.singleAppQueryKey,
          context.previousSingleData
        );
      }

      if (context?.previousListData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousListData);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({
        queryKey: ["application", variables.applicationId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

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
