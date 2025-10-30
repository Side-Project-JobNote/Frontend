"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import { useDocuments } from "@/hooks/useDocuments";
import FileIcon from "@/assets/File.svg";
import { useRouter } from "next/navigation";
import {
  useFetchApplication,
  useUpdateApplication,
} from "@/hooks/useApplications";
import {
  ApplicationStatus,
  CompanyApplication,
  CompanyApplicationWithId,
  ScheduleStatus,
  typeLabels,
} from "@/type/applicationType";

export default function EditApplicationsPage({ id }: { id: number }) {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyScale, setCompanyScale] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>(
    ApplicationStatus.PLANNED
  );
  const [selectedDocuments, setSelectedDocuments] = useState<
    { id: number; type: string; title: string }[]
  >([]);
  const [applyDate, setApplyDate] = useState<Date | null>(null);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

  const [originalApplication, setOriginalApplication] =
    useState<CompanyApplicationWithId | null>(null);

  const { data: documentsData, isLoading, isError } = useDocuments(1);
  const { data, isLoading: isAppLoading } = useFetchApplication(id);
  const { mutateAsync, isPending: isUploadLoading } = useUpdateApplication();

  const documents = documentsData?.data.data.content;
  const router = useRouter();

  useEffect(() => {
    if (!data || originalApplication) return; // 초기 한 번만 세팅

    const app = data.data.data;
    setOriginalApplication(app);

    setCompanyName(app.companyName ?? "");
    setCompanyAddress(app.companyAddress ?? "");
    setCompanyUrl(app.companyUrl ?? "");
    setCompanyScale(app.companyScale ?? "");
    setPosition(app.position ?? "");
    setStatus(app.status ?? ApplicationStatus.PLANNED);

    // 지원일
    const apply = app.schedules?.find(
      (s: { memo?: string }) => s.memo === "지원일"
    );
    const applyDateObj = apply?.dateTime ? new Date(apply.dateTime) : null;
    setApplyDate(isNaN(applyDateObj?.getTime() ?? NaN) ? null : applyDateObj);

    // 마감일
    const deadline = app.schedules?.find(
      (s: { memo?: string }) => s.memo === "마감일"
    );
    const deadlineDateObj = deadline?.dateTime
      ? new Date(deadline.dateTime)
      : null;
    setDeadlineDate(
      isNaN(deadlineDateObj?.getTime() ?? NaN) ? null : deadlineDateObj
    );

    setSelectedDocuments(app.documents ?? []);
  }, [data, originalApplication]);

  // 문서 선택 토글 함수
  const toggleDocument = (doc: { id: number; type: string; title: string }) => {
    setSelectedDocuments((prev) =>
      prev.some((d) => d.id === doc.id)
        ? prev.filter((d) => d.id !== doc.id)
        : [...prev, doc]
    );
  };

  // 마감일 상태 계산 함수
  const getDeadlineStatus = (appStatus: ApplicationStatus): ScheduleStatus => {
    switch (appStatus) {
      case ApplicationStatus.PLANNED:
        return ScheduleStatus.PLANNED;
      case ApplicationStatus.APPLIED:
        return ScheduleStatus.PROGRESS;
      case ApplicationStatus.DOCUMENT_PASSED:
      case ApplicationStatus.FINAL_PASSED:
      case ApplicationStatus.REJECTED:
        return ScheduleStatus.COMPLETED;
      default:
        return ScheduleStatus.PLANNED;
    }
  };

  const handleSubmit = async () => {
    if (!originalApplication) {
      alert("데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (companyName === "") {
      alert("회사이름을 입력하세요.");
      return;
    }

    if (position === "") {
      alert("직무를 입력하세요");
      return;
    }

    const changedApplication = JSON.parse(JSON.stringify(originalApplication));

    changedApplication.companyName = companyName;
    changedApplication.companyAddress = companyAddress;
    changedApplication.companyUrl = companyUrl;
    changedApplication.companyScale = companyScale;
    changedApplication.position = position;
    changedApplication.status = status;
    changedApplication.documents = selectedDocuments;

    const applySchedule = changedApplication.schedules.find(
      (s: { memo?: string }) => s.memo === "지원일"
    );
    if (applySchedule) {
      applySchedule.dateTime = applyDate ? applyDate.toISOString() : "";
    }

    const deadlineSchedule = changedApplication.schedules.find(
      (s: { memo?: string }) => s.memo === "마감일"
    );
    if (deadlineSchedule) {
      deadlineSchedule.dateTime = deadlineDate
        ? deadlineDate.toISOString()
        : "";
      deadlineSchedule.status = getDeadlineStatus(status);
    }

    try {
      await mutateAsync({
        changedApplication: changedApplication as CompanyApplication,
        applicationId: id,
      });

      alert("지원서가 정상적으로 수정되었습니다!");
      router.replace("/applications");
    } catch {
      alert("지원서 수정 중 오류가 발생했습니다.");
    }
  };

  if (isAppLoading) return <p>지원서 불러오는 중...</p>;

  return (
    <div className="flex flex-col">
      <h2 className="font-medium text-3xl mt-8 mb-6">기본 정보</h2>

      <div className="flex flex-col gap-2 w-96">
        <section className="flex flex-col gap-2">
          <label>
            <span className="text-[#FF4D4F]">*</span>회사 이름
          </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="회사 이름을 작성해주세요."
            className="border border-[#DCDCDC] py-1 px-3 rounded-sm placeholder:text-black/25"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>
            <span className="text-[#FF4D4F]">*</span>직무
          </label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="직무를 입력해주세요."
            className="border border-[#DCDCDC] py-1 px-3 rounded-sm placeholder:text-black/25"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>지원 URL</label>
          <input
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            placeholder="지원한 사이트 주소를 입력해주세요."
            className="border border-[#DCDCDC] py-1 px-3 rounded-sm placeholder:text-black/25"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>기업 유형</label>
          <select
            value={companyScale}
            onChange={(e) => setCompanyScale(e.target.value)}
            className="border border-[#DCDCDC] py-1 px-3 rounded-sm"
          >
            <option value="" disabled>
              기업 유형을 선택해주세요
            </option>
            <option value="STARTUP">스타트업</option>
            <option value="SME">중소기업</option>
            <option value="LARGE">대기업</option>
            <option value="FOREIGN">외국계</option>
            <option value="PUBLIC">공기업</option>
          </select>
        </section>

        <section className="flex flex-col gap-2">
          <label>위치</label>
          <input
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder="회사 위치를 작성해주세요."
            className="border border-[#DCDCDC] py-1 px-3 rounded-sm placeholder:text-black/25 w-full"
          />
        </section>
      </div>

      <h2 className="font-medium text-3xl mt-10">일정 등록</h2>

      <div className="mt-6 flex flex-row gap-4 w-3xl">
        <div className="flex flex-col w-full gap-2">
          <label>지원일</label>
          <DatePicker
            locale={ko}
            placeholderText="날짜를 선택해주세요."
            selected={applyDate}
            onChange={(date) => setApplyDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-[#DCDCDC] px-2 py-1 rounded-sm w-full"
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label>마감일</label>
          <DatePicker
            locale={ko}
            placeholderText="날짜를 선택해주세요."
            selected={deadlineDate}
            onChange={(date) => setDeadlineDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-[#DCDCDC] px-2 py-1 rounded-sm w-full"
          />
        </div>
      </div>

      <h2 className="font-medium text-3xl mt-10">상태 및 문서</h2>

      <div className="mt-6 flex flex-col gap-2 w-96">
        <label>
          <span className="text-[#FF4D4F]">*</span>지원 상태
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          className="border border-[#DCDCDC] px-2 py-1 rounded-sm text-black/75"
        >
          {Object.values(ApplicationStatus).map((s) => (
            <option key={s} value={s}>
              {s === ApplicationStatus.PLANNED
                ? "지원 예정"
                : s === ApplicationStatus.APPLIED
                ? "지원 완료"
                : s === ApplicationStatus.DOCUMENT_PASSED
                ? "서류 합격"
                : s === ApplicationStatus.FINAL_PASSED
                ? "최종 합격"
                : "불합격"}
            </option>
          ))}
        </select>
      </div>

      <h3 className="font-medium text-xl mt-10 mb-4">문서 선택</h3>
      <div className="flex flex-wrap gap-4">
        {isLoading && <p>문서를 불러오는 중...</p>}
        {isError && <p>문서를 불러오는 중에 오류가 발생했습니다.</p>}

        {!isLoading &&
          documents?.map(
            (document: {
              id: number;
              type: string;
              title: string;
              latestVersion: number;
            }) => {
              const isSelected = selectedDocuments.some(
                (d) => d.id === document.id
              );
              return (
                <div
                  key={document.id}
                  onClick={() => toggleDocument(document)}
                  className={`px-4 py-5 border text-sm text-center flex flex-col justify-center items-center gap-3 rounded-sm cursor-pointer transition
                    ${isSelected ? "border-[#FF9016]" : "border-[#D9D9D9]"}`}
                >
                  <span className="flex flex-row items-center gap-1 text-[#212121]">
                    <FileIcon />
                    {document.title}
                  </span>
                  <span className="text-[#424242]">
                    {typeLabels[document.type] ?? document.type} V
                    {document.latestVersion}
                  </span>
                </div>
              );
            }
          )}
      </div>

      <div className="mt-9 mb-8 w-full flex justify-end">
        <button
          onClick={handleSubmit}
          className="w-16 py-1 bg-main text-white rounded-sm"
          disabled={isUploadLoading}
        >
          {isUploadLoading ? "수정 중..." : "수정"}
        </button>
      </div>
    </div>
  );
}
