"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useFetchAllApplications,
  useUpdateApplication,
  useDeleteApplication,
} from "@/hooks/useApplications";
import Divider from "../documents/_components/divider";
import LoadingSpinner from "@/app/_components/loadingSpinner";
import SearchIcon from "@/assets/Search.svg";
import PlusIcon from "@/assets/Plus.svg";
import { ApplicationStatus, CompanyApplicationWithId, Schedule } from "@/type/applicationType";
import PencilSimpleIcon from "@/assets/PencilSimple.svg";
import TrashSimpleIcon from "@/assets/TrashSimple.svg";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError, refetch } = useFetchAllApplications(
    page,
    searchQuery
  );
  const { mutate: updateMutate } = useUpdateApplication();
  const { mutateAsync: deleteMutateAsync } = useDeleteApplication();

  const applications = data?.data.content ?? [];
  const pageInfo = data?.data;
  const filteredApplications = applications;

  useEffect(() => {
    setSelectedIds([]);
  }, [page, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredApplications.map((app: CompanyApplicationWithId) =>
        app.id.toString()
      );
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectOne = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleEdit = () => {
    if (selectedIds.length !== 1) {
      alert("수정할 항목을 하나만 선택해주세요.");
      return;
    }
    router.push(`/applications/edit/${selectedIds[0]}`);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }
    if (
      window.confirm(
        `선택된 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`
      )
    ) {
      const deletePromises = selectedIds.map((id) =>
        deleteMutateAsync(Number(id))
      );

      try {
        await Promise.all(deletePromises);

        alert("선택된 항목이 모두 삭제되었습니다.");
        setSelectedIds([]);
        refetch();
      } catch {
        alert("일부 항목 삭제에 실패했습니다. 페이지를 새로고침합니다.");
        refetch();
      }
    }
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setPage((prev) =>
      pageInfo ? Math.min(prev + 1, pageInfo.totalPages - 1) : prev
    );

  const handlePageClick = (i: number) => setPage(i);

  const th_style = "relative text-center p-4 text-sm font-medium";
  const td_style = "text-center p-4 text-sm";

  const handleStatusChange = (
    app: CompanyApplicationWithId,
    newStatus: string
  ) => {
    const queryKey = ["applications", page, searchQuery];
    updateMutate({
      applicationId: app.id,
      changedApplication: { ...app, status: newStatus as ApplicationStatus },
      queryKey: queryKey,
      newStatus: newStatus,
    });
  };

  // const formatUrl = (url?: string) => {
  //   if (!url) return "";
  //   if (url.startsWith("http://") || url.startsWith("https://")) {
  //     return url;
  //   }
  //   return `https://${url}`;
  // };

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2 mt-8">
        <div className="border border-[#D9D9D9] rounded-sm flex items-center">
          <input
            type="text"
            placeholder="회사명 검색하기"
            className="px-2 py-1 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-2 py-1 border-l border-l-[#D9D9D9]">
            <SearchIcon />
          </button>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Link
            href="/applications/new"
            className="w-8 h-8 flex flex-row items-center justify-center border border-[#FF9016] rounded-sm"
          >
            <PlusIcon width={14} height={14} fill={"#FF9016"} />
          </Link>
          <button
            onClick={handleEdit}
            className={`w-8 h-8 flex flex-row justify-center items-center border rounded-xs ${
              selectedIds.length === 1 ? "border-[#485C8B]" : "border-[#9E9E9E]"
            }`}
          >
            <PencilSimpleIcon
              fill={selectedIds.length === 1 ? "#485C8B" : "#9e9e9e"}
            />
          </button>
          <button
            onClick={handleDelete}
            className={`w-8 h-8 flex flex-row justify-center items-center border rounded-xs ${
              selectedIds.length > 0 ? "border-[#FA4343]" : "border-[#9E9E9E]"
            }`}
          >
            <TrashSimpleIcon
              fill={selectedIds.length > 0 ? "#FA4343" : "#9e9e9e"}
            />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-center mt-8 p-4 bg-red-50 rounded-md">
          에러가 발생하였습니다. <br /> 잠시 후 시도해주세요.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <table className="table-auto w-full border-collapse mt-4">
            <thead>
              <tr className="border-b border-b-black/5 bg-[#FAFAFA]">
                <th className={th_style}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredApplications.length > 0 &&
                      selectedIds.length === filteredApplications.length
                    }
                  />
                  <Divider />
                </th>
                <th className={th_style}>
                  회사명 <Divider />
                </th>
                <th className={th_style}>
                  지역 <Divider />
                </th>
                <th className={th_style}>
                  연동 문서 <Divider />
                </th>
                <th className={th_style}>
                  직무 <Divider />
                </th>
                <th className={th_style}>
                  마감일 <Divider />
                </th>
                <th className={th_style}>
                  상태 <Divider />
                </th>
                <th className={th_style}>지원 날짜</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app: CompanyApplicationWithId) => {
                  const deadline =
                    app.schedules?.find(
                      (s: Schedule) => s.memo && s.memo === "마감일"
                    )?.dateTime || null;

                  return (
                    <tr
                      key={app.id}
                      className={`border-b border-b-black/5 ${
                        selectedIds.includes(app.id.toString())
                          ? "bg-orange-50"
                          : ""
                      }`}
                    >
                      <td className={td_style}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app.id.toString())}
                          onChange={(e) =>
                            handleSelectOne(e, app.id.toString())
                          }
                        />
                      </td>
                      <td className={td_style}>
                        <span>{app.companyName}</span>
                      </td>
                      <td className={td_style}>{app.companyAddress || "-"}</td>
                      <td className={td_style}>
                        <div className="max-w-[200px] mx-auto overflow-x-auto flex flex-row gap-1 minimal-scrollbar">
                          {app.documents && app.documents.length > 0 ? (
                            app.documents.map((doc) => (
                              <div
                                className="text-xs bg-[#FFE09B] rounded-sm px-2 py-1 whitespace-nowrap"
                                key={doc.id}
                              >
                                {doc.title}
                              </div>
                            ))
                          ) : (
                            <div className="text-center w-full">-</div>
                          )}
                        </div>
                      </td>
                      <td className={td_style}>
                        {app.position ? app.position : "-"}
                      </td>
                      <td className={td_style}>{formatDate(deadline)}</td>
                      <td className={td_style}>
                        <select
                          className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs hover:cursor-pointer"
                          value={app.status}
                          onChange={(e) => {
                            handleStatusChange(app, e.target.value);
                          }}
                        >
                          <option value="PLANNED">지원 예정</option>
                          <option value="APPLIED">지원 완료</option>
                          <option value="DOCUMENT_PASSED">서류 합격</option>
                          <option value="REJECTED">불합격</option>
                          <option value="FINAL_PASSED">최종 합격</option>
                        </select>
                      </td>
                      <td className={td_style}>
                        {app.schedules
                          ? formatDate(app.schedules[0]?.dateTime)
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    {searchQuery
                      ? "검색 결과가 없습니다."
                      : "등록된 지원내역이 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-8 pb-8">
            <button
              onClick={handlePrevPage}
              disabled={pageInfo.first}
              className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: pageInfo.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageClick(i)}
                className={`px-3 py-1 border rounded-md ${
                  page === i ? "bg-orange-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={pageInfo.last}
              className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </>
      )}
    </>
  );
}
