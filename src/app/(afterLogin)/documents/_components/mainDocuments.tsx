"use client";

import { useState, useRef, useEffect } from "react";
import { formatDate } from "date-fns";
import { useCreateDocument, useDocuments } from "@/hooks/useDocuments";
import VersionBadge from "./versionBadge";
import CompanyNameBadge from "./companyNameBadge";
import Divider from "./divider";
import PlusIcon from "@/assets/Plus.svg";
import LoadingSpinner from "@/app/_components/loadingSpinner";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/store/documents/documentStore";
import { DocumentTypeWithId } from "@/type/documentType";
import UploadFileButton from "./uploadFileButton";

export default function MainDocuments() {
  const [page, setPage] = useState(0);
  const { data, error, isLoading } = useDocuments(page);
  const documents = data?.data?.data.content ?? [];
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileKey, setFileKey] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
    size: number;
  } | null>(null);

  const { mutate, isPending } = useCreateDocument();

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (!isLoading && documents.length === 0) {
      setIsAdding(true);
    }
  }, [isLoading, documents]);

  const handleRoute = (doc: DocumentTypeWithId) => {
    useDocumentStore.setState({ document: doc });
    router.push(`/documents/${doc.id}`);
  };

  const handleBlur = () => {
    if (newDocumentTitle === "") {
      if (documents.length > 0) {
        setIsAdding(false);
        setNewDocumentTitle("");
      }
    }
  };

  const handleAddDocument = () => {
    setIsAdding(true);
  };

  const handleSaveNewDocument = () => {
    setIsAdding(false);
    setNewDocumentTitle("");

    mutate({
      title: newDocumentTitle,
      fileName: fileInfo?.name || "",
      fileKey: fileKey || "",
      fileType: "RESUME",
      fileSize: fileInfo?.size || 0,
    });
  };

  const handleCancelAdd = () => {
    if (documents.length > 0) {
      setIsAdding(false);
      setNewDocumentTitle("");
    }
  };

  const th_style = "relative text-center p-4 font-medium";
  const td_stytle = "text-center p-4";
  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div>
          에러가 발생하였습니다. <br /> 잠시 후 시도해주세요.
        </div>
      )}
      {data && !isLoading && (
        <table className="table-fixed w-full border-collapse mt-4">
          <thead>
            <tr className="border-b border-b-black/5 bg-[#FAFAFA]">
              <th className="w-12 relative">
                <Divider />
              </th>
              <th className={th_style}>
                문서명 <Divider />
              </th>
              <th className={th_style}>
                Version <Divider />
              </th>
              <th className={th_style}>
                올리기 <Divider />
              </th>
              <th className={th_style}>
                회사명 <Divider />
              </th>
              <th className={th_style}>최종수정날짜</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc: DocumentTypeWithId) => {
              return (
                <tr key={doc.id} className="border-b border-b-black/5">
                  <td className={td_stytle}></td>
                  <td className={td_stytle}>
                    <button onClick={() => handleRoute(doc)}>
                      {doc.title}
                    </button>
                  </td>
                  <td className={td_stytle}>
                    <VersionBadge>{doc.latestVersion}</VersionBadge>
                  </td>
                  <td>
                    <UploadFileButton
                      isUpdate={true}
                      documentId={doc.id}
                      newDocumentTitle={doc.title}
                      setFileKey={setFileKey}
                      setFileInfo={setFileInfo}
                    />
                  </td>
                  <td className={td_stytle}>
                    <div className="max-w-[11rem] flex flex-row gap-2 justify-start flex-nowrap overflow-x-auto minimal-scrollbar">
                      {doc.applicationForms.length === 0 ? (
                        <span className="text-sm">
                          아직 연동된 회사가 없습니다.
                        </span>
                      ) : (
                        doc.applicationForms.map((history) => (
                          <CompanyNameBadge
                            key={history.id ?? history.companyName}
                          >
                            {history.companyName}
                          </CompanyNameBadge>
                        ))
                      )}
                    </div>
                  </td>

                  <td className={`${td_stytle} text-[#616161]`}>
                    {formatDate(new Date(doc.lastModifiedDate), "yyyy.MM.dd")}
                  </td>
                </tr>
              );
            })}

            {isAdding ? (
              <tr className="border-b border-b-black/5 bg-gray-50">
                <td className={td_stytle}></td>
                <td className={td_stytle}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newDocumentTitle}
                    onChange={(e) => setNewDocumentTitle(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="새 문서명을 입력하세요"
                    className="w-full p-2 rounded-md text-center"
                  />
                </td>
                <td className={td_stytle}>
                  <VersionBadge>{1}</VersionBadge>
                </td>
                <td className={td_stytle}>
                  <UploadFileButton
                    isUpdate={false}
                    setFileKey={setFileKey}
                    setFileInfo={setFileInfo}
                  />
                </td>
                <td className={td_stytle}></td>
                <td
                  className={td_stytle + " flex flex-row justify-center gap-2"}
                >
                  <button
                    className={`bg-main text-white text-sm rounded-xs px-2 py-px ${
                      isPending ? "opacity-50" : ""
                    }`}
                    disabled={isPending}
                    onClick={handleSaveNewDocument}
                  >
                    저장
                  </button>
                  {documents.length > 0 && (
                    <button
                      className={`bg-main text-white text-sm rounded-xs px-2 py-px ${
                        isPending ? "opacity-50" : ""
                      }`}
                      disabled={isPending}
                      onClick={handleCancelAdd}
                    >
                      취소
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              <tr className="border-b border-b-black/5">
                <td className={td_stytle}>
                  <button
                    onClick={handleAddDocument}
                    className="p-0.5 border border-[#D9D9D9] flex justify-center items-center rounded-xs"
                  >
                    <PlusIcon fill="#000000" />
                  </button>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          이전
        </button>

        {Array.from({ length: data?.data.data.totalPages ?? 0 }).map(
          (_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 border rounded-md ${
                page === idx ? "bg-orange-500 text-white" : ""
              }`}
              onClick={() => setPage(idx)}
            >
              {idx + 1}
            </button>
          )
        )}

        <button
          className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === (data?.data.data.totalPages ?? 1) - 1}
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, (data?.data.data.totalPages ?? 1) - 1)
            )
          }
        >
          다음
        </button>
      </div>
    </>
  );
}
