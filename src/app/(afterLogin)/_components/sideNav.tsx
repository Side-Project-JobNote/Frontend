import Link from "next/link";
import BriefCase from "@/assets/Briefcase.svg";
import CalendarBlank from "@/assets/CalendarBlank.svg";
import ClipboardText from "@/assets/ClipboardText.svg";
import House from "@/assets/House.svg";
import UserInfo from "./userInfo";

export default function SideNavigation() {
  return (
    <div className="fixed top-32 left-11 border border-[#FFE8CC] rounded-lg px-10 py-8 flex flex-col items-center bg-white">
      <UserInfo />

      <button className="mt-4 text-main border border-[#FF9016] px-4 py-1">
        개인정보수정
      </button>

      <nav className="flex flex-col items-start gap-8 text-xl font-medium mt-15">
        <Link href="/dashboard" className="flex flex-row gap-2 items-center">
          <House />
          dashboard
        </Link>
        <Link href="/applications" className="flex flex-row gap-2 items-center">
          <BriefCase />
          지원 현황
        </Link>
        <Link href="/documents" className="flex flex-row gap-2 items-center">
          <ClipboardText />
          문서 관리
        </Link>
        <Link href="/schedule" className="flex flex-row gap-2 items-center">
          <CalendarBlank />
          일정
        </Link>
      </nav>
    </div>
  );
}
