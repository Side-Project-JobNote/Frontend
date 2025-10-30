"use client";

import Divider from "../../_components/divider";
import DownloadIcon from "@/assets/Download.svg";
import { useDocumentStore } from "@/store/documents/documentStore";
import { ApplicationStatus, Document } from "@/type/applicationType";
import { DocumentType } from "@/type/documentType";
import TrashIcon from "@/assets/Trash.svg";
import { fetchApplication } from "@/lib/applications";
import { useUpdateApplication } from "@/hooks/useApplications";

const getStatusText = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.PLANNED:
      return "지원 예정";
    case ApplicationStatus.APPLIED:
      return "지원 완료";
    case ApplicationStatus.DOCUMENT_PASSED:
      return "서류 합격";
    case ApplicationStatus.FINAL_PASSED:
      return "최종 합격";
    case ApplicationStatus.REJECTED:
      return "불합격";
    default:
      return status;
  }
};

const getTypeText = (type: string): string => {
  switch (type) {
    case "RESUME":
      return "이력서";
    case "COVER_LETTER":
      return "자기소개서";
    case "PORTFOLIO":
      return "포트폴리오";
    default:
      return type;
  }
};

export default function DocumentDescription({
  documentVersions,
}: {
  documentVersions: DocumentType[];
}) {
  const activeDocument = useDocumentStore((state) => state.document);
  const setDocument = useDocumentStore((state) => state.setDocument);

  const { mutateAsync } = useUpdateApplication();

  const handleDownload = async (fileUrl: string, fileName: string) => {
    if (!fileUrl) {
      alert("다운로드할 수 있는 파일 URL이 없습니다.");
      return;
    }

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("파일을 다운로드하는 데 실패했습니다.");
      }
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName || "document");
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      alert("파일 다운로드 중 오류가 발생했습니다.");
    }
  };
  if (!activeDocument || !activeDocument.applicationForms) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p>문서 정보를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const handleDeleteCompany = async (companyIdToDelete: string) => {
    try {
      const { data: application } = await fetchApplication(
        Number(companyIdToDelete)
      );

      const updatedDocuments = application.data.documents.filter(
        (doc: Document) => doc.id !== activeDocument.id
      );

      const updatedApplication = {
        ...application.data,
        documents: updatedDocuments,
      };

      mutateAsync({
        changedApplication: updatedApplication,
        applicationId: activeDocument.id,
      });

      const updatedApplicationForms = activeDocument.applicationForms.filter(
        (application) => application.id !== companyIdToDelete
      );

      const updatedActiveDocument = {
        ...activeDocument,
        applicationForms: updatedApplicationForms,
      };

      setDocument(updatedActiveDocument);

      alert("지원 정보가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Failed to delete company:", error);
      alert("지원 정보 삭제 중 오류가 발생했습니다.");
    }
  };

  const companies = activeDocument.applicationForms;

  const th_style = "relative text-center py-2 font-normal";
  const td_stytle = "text-center py-2";

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl mb-6">{activeDocument.title}</h2>
        {companies.length === 0 ? (
          <span className="text-sm text-center">
            아직 연동된 회사가 없습니다.
          </span>
        ) : (
          companies?.map((company) => {
            const statusText = getStatusText(
              company.status as ApplicationStatus
            );
            return (
              <section
                key={company.id}
                className="border border-[#747474] rounded-sm px-5 py-2.5 flex flex-col gap-5"
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4 items-center">
                      <h3 className="font-semibold text-2xl">
                        {company.companyName}
                      </h3>
                      <span className="text-xs bg-[#485C8B] text-white px-2 py-1 rounded-xs">
                        {statusText}
                      </span>
                    </div>
                    <span className="">주소: {company.companyAddress}</span>
                  </div>

                  <button onClick={() => handleDeleteCompany(company.id)}>
                    <TrashIcon />
                  </button>
                </div>
              </section>
            );
          })
        )}
      </div>

      <div>
        <h3 className="font-medium text-3xl mt-14 mb-10">버전 관리</h3>

        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="bg-[#FAFAFA] w-full">
              <th className={th_style}>
                파일명
                <Divider />
              </th>
              <th className={th_style}>
                Version
                <Divider />
              </th>
              <th className={th_style}>
                종류
                <Divider />
              </th>
              <th className={th_style}>
                업로드날짜
                <Divider />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {documentVersions.map((documentVersion) => {
              return (
                <tr
                  className="border border-[#E0E0E0]"
                  key={documentVersion.fileKey}
                >
                  <td className={td_stytle}>{documentVersion.fileName}</td>
                  <td className={td_stytle}>
                    Version {documentVersion.version}
                  </td>
                  <td className={td_stytle + " flex justify-center"}>
                    <div className="bg-[#BFC7DA] w-14 rounded-xs">
                      {getTypeText(activeDocument.type)}
                    </div>
                  </td>
                  <td className={td_stytle}>
                    {new Date(documentVersion.createdDate!).toLocaleDateString()}
                  </td>
                  <td className={td_stytle}>
                    <button
                      onClick={() => {
                        handleDownload(
                          documentVersion.fileUrl || "",
                          documentVersion.fileName
                        );
                      }}
                    >
                      <DownloadIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
