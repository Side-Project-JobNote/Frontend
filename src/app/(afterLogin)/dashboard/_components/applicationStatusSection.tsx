"use client";

import { useFetchAllApplications } from "@/hooks/useApplications";
import { useMemo } from "react";
import { CompanyApplication } from "@/type/applicationType";

export default function ApplicationStatusSection() {
  const { data: ApplicationsData, isLoading } = useFetchAllApplications(0, "");

  const applicationStatus = useMemo(() => {
    if (!ApplicationsData?.data.content) {
      return { APPLIED: 0, DOCUMENT_PASSED: 0, FINAL_PASSED: 0, REJECTED: 0 };
    }

    const applications = ApplicationsData.data
      .content as Array<CompanyApplication>;

    return applications.reduce(
      (counts, app) => {
        if (counts.hasOwnProperty(app.status)) {
          counts[app.status as keyof typeof counts]++;
        }
        return counts;
      },
      { APPLIED: 0, DOCUMENT_PASSED: 0, FINAL_PASSED: 0, REJECTED: 0 }
    );
  }, [ApplicationsData]);

  const box_style = "w-60 border rounded-sm px-9 py-5 flex flex-col gap-4";
  return (
    <section className="relative top-10 flex flex-row gap-6">
      <div
        className={`${box_style} ${
          applicationStatus.APPLIED
            ? "border-[#FF9016] font-semibold"
            : "border-[#E0E0E0] text-[#696F8C]"
        }`}
      >
        <span className="w-full text-left">지원 회사</span>
        <span className="w-full text-right">{applicationStatus.APPLIED}개</span>
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
  );
}
