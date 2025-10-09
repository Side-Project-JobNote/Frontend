"use client";

import Link from "next/link";
import BriefCase from "@/assets/Briefcase.svg";
import CalendarBlank from "@/assets/CalendarBlank.svg";
import ClipboardText from "@/assets/ClipboardText.svg";
import House from "@/assets/House.svg";
import UserInfo from "./userInfo";
import { useSelectedLayoutSegments } from "next/navigation";
import { useModalStore } from "@/store/modalStore";

export default function SideNavigation() {
  const { setIsModal } = useModalStore();
  const segments = useSelectedLayoutSegments();
  const pathname = segments[0];

  return (
    <div className="fixed top-32 left-11 border border-[#FFE8CC] rounded-lg px-10 py-8 flex flex-col items-center bg-white">
      <UserInfo />

      <button
        onClick={() => {
          setIsModal(true);
        }}
        className="mt-4 text-main border border-[#FF9016] px-4 py-1"
      >
        개인정보수정
      </button>

      <nav className="flex flex-col items-start gap-8 text-xl font-medium mt-15">
        <Link
          href="/dashboard"
          className={`flex flex-row gap-2 items-center ${
            pathname === "dashboard" ? "font-bold" : ""
          }`}
        >
          <House />
          Dashboard
        </Link>

        <Link
          href="/applications"
          className={`flex flex-row gap-2 items-center ${
            pathname === "applications" ? "font-bold" : ""
          }`}
        >
          <BriefCase />
          지원 현황
        </Link>

        <Link
          href="/documents"
          className={`flex flex-row gap-2 items-center ${
            pathname === "documents" ? "font-bold" : ""
          }`}
        >
          <ClipboardText />
          문서 관리
        </Link>

        <Link
          href="/schedule"
          className={`flex flex-row gap-2 items-center ${
            pathname === "schedule" ? "font-bold" : ""
          }`}
        >
          <CalendarBlank />
          일정
        </Link>
      </nav>
    </div>
  );
}
