"use client";

import { useSchedule } from "@/hooks/useSchedule";
import { Schedule } from "@/type/applicationType";
import CalendarIcon from "@/assets/CalendarCheck.svg";
import { useMemo } from "react";

function formatDateToApiString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

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

export default function ScheduleSection() {
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + 7);

    return {
      startDate: formatDateToApiString(now),
      endDate: formatDateToApiString(futureDate),
    };
  }, []);

  const { data: ScheduleData, isLoading: scheduleLoading } = useSchedule(
    startDate,
    endDate
  );

  return (
    <section className="relative top-28 flex flex-col">
      <h2 className="text-3xl font-semibold mb-6">다가오는 일정</h2>

      <div className="flex flex-col gap-4">
        {ScheduleData?.data.content.map((schedule: Schedule) => (
          <div
            key={schedule.id}
            className="w-full border border-[#E7E7E7] rounded-lg px-5 py-3.5 text-xl font-medium"
          >
            <span className="flex flex-row gap-2 items-center">
              <CalendarIcon />
              {schedule.title}
              <div className="text-xs text-main bg-[#FFF2E3] px-2 rounded-full">
                {getDDay(schedule.dateTime)}
              </div>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
