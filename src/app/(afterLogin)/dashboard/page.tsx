"use client";

import { Schedule } from "@/type/applicationType";
import CalendarIcon from "@/assets/CalendarCheck.svg";
import LoadingSpinner from "@/app/_components/loadingSpinner";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const applicationStatus = data?.applicationStatusCounts;
  const scheduleData = data?.scheduleData;

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <span className="text-red-500">오류가 발생하였습니다. 잠시 후 시도해주세요.</span>;

  const box_style = "w-60 border rounded-sm px-9 py-5 flex flex-col gap-4";
  return (
    <>
      <section className="relative top-10 flex flex-row gap-6">
        <div
          className={`${box_style} ${
            applicationStatus.APPLIED
              ? "border-[#FF9016] font-semibold"
              : "border-[#E0E0E0] text-[#696F8C]"
          }`}
        >
          <span className="w-full text-left">지원 회사</span>
          <span className="w-full text-right">
            {applicationStatus.APPLIED}개
          </span>
        </div>
        <div
          className={`${box_style} ${
            applicationStatus.DOCUMENT_PASSED
              ? "border-[#FF9016] font-semibold"
              : "border-[#E0E0E0] text-[#696F8C]"
          }`}
        >
          <span className="w-full text-left">서류 합격</span>
          <span className="w-full text-right">
            {applicationStatus.DOCUMENT_PASSED}개
          </span>
        </div>
        <div
          className={`${box_style} ${
            applicationStatus.REJECTED
              ? "border-[#FF9016] font-semibold"
              : "border-[#E0E0E0] text-[#696F8C]"
          }`}
        >
          <span className="w-full text-left">불합격</span>
          <span className="w-full text-right">
            {applicationStatus.REJECTED}개
          </span>
        </div>
        <div
          className={`${box_style} ${
            applicationStatus.FINAL_PASSED
              ? "border-[#FF9016] font-semibold"
              : "border-[#E0E0E0] text-[#696F8C]"
          }`}
        >
          <span className="w-full text-left">최종 합격</span>
          <span className="w-full text-right">
            {applicationStatus.FINAL_PASSED}개
          </span>
        </div>
      </section>

      <section className="relative top-28 flex flex-col">
        <h2 className="text-3xl font-semibold mb-6">다가오는 일정</h2>

        <div className="flex flex-col gap-4">
          {scheduleData?.map((schedule: Schedule & { dday: string }) => (
            <div
              key={schedule.id}
              className="w-full border border-[#E7E7E7] rounded-lg px-5 py-3.5 text-xl font-medium"
            >
              <span className="flex flex-row gap-2 items-center">
                <CalendarIcon />
                {schedule.title}
                <div className="text-xs text-main bg-[#FFF2E3] px-2 rounded-full">
                  {schedule.dday}
                </div>
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
