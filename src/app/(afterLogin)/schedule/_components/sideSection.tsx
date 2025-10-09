"use client";

import CalendarCheck from "@/assets/CalendarCheck.svg";
import { useSchedule } from "@/hooks/useSchedule";
import { Schedule } from "@/type/schedule";
import LoadingSpinner from "@/app/_components/loadingSpinner";

export default function SideSection() {
  function formatDateToApiString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  const startDate = formatDateToApiString(new Date());
  const endDate = formatDateToApiString(
    new Date(new Date().setDate(new Date().getDate() + 7))
  );

  function getDDay(dateTime: string) {
    const today = new Date();
    const targetDate = new Date(dateTime);

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const targetOnly = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );

    const diffTime = targetOnly.getTime() - todayOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `D-${diffDays}`;
    else if (diffDays === 0) return `D-Day`;
    else return `D+${Math.abs(diffDays)}`;
  }

  const { data: scheduleData, isLoading: scheduleLoading } = useSchedule(
    startDate,
    endDate
  );

  if (scheduleLoading) return <LoadingSpinner />;

  return (
    <div className="flex-1/3 flex flex-col gap-5">
        {scheduleData?.data.content.map((schedule: Schedule) => (
      <div key={schedule.id} className="py-4 px-5 border border-[#E7E7E7] rounded-lg">
        <div className="flex flex-row gap-2 items-center">
          <CalendarCheck />
          <span className="text-xl font-medium">{schedule.title}</span>
          <span className="text-xs ml-2 bg-[#FFF2E3] text-main rounded-full py-px px-2">
            {getDDay(schedule.dateTime)}
          </span>
        </div>
      </div>
      ))}
    </div>
  );
}
