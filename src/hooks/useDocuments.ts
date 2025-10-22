import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from "@/lib/documents";
import { DocumentType } from "@/type/documentType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDocuments = (page: number) => {
  return useQuery({
    queryKey: ["documents", page],
    queryFn: () => getDocuments(page),
    staleTime: 1000 * 60 * 60,
  });
};

// 문서 상세 조회 훅
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => getDocumentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};

// 신규 문서 등록 훅
export const useCreateDocument = () => {
  const queryClient = useQueryClient(); // 캐시 무효화를 위해 사용
  return useMutation({
    mutationFn: createDocument, // 등록 요청
    onSuccess: () => {
      // 성공 시 문서 목록 캐시 무효화 → 자동 갱신
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// 새로운 버전 업로드 훅
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fileInfo }: { id: string; fileInfo: DocumentType }) =>
      uploadDocument(id, fileInfo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// 문서 삭제 훅
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      // 삭제 후 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
