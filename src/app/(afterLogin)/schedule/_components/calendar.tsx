"use client";

import { useState } from "react";
import { useSchedule } from "@/hooks/useSchedule";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import LoadingSpinner from "@/app/_components/loadingSpinner";
import koLocale from "@fullcalendar/core/locales/ko";

export default function Calendar() {
  function formatDateToApiString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = "00";
    const minutes = "00";
    const seconds = "00";
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      start: formatDateToApiString(startOfMonth),
      end: formatDateToApiString(endOfMonth),
    };
  });

  const { data: scheduleData, isLoading: scheduleLoading } = useSchedule(
    dateRange.start,
    dateRange.end
  );

  const events =
    scheduleData?.data.content
      .filter((schedule: { memo: string }) => schedule.memo === "마감일")
      .map((schedule: { title: string; dateTime: string }) => ({
        title: schedule.title,
        date: schedule.dateTime,
      })) || [];

  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    const newStartDate = formatDateToApiString(arg.start);
    const newEndDate = formatDateToApiString(arg.end);

    setDateRange({ start: newStartDate, end: newEndDate });
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      locale={koLocale}
      dayMaxEvents={true}
      events={events}
      displayEventTime={false}
      datesSet={handleDatesSet}
      loading={scheduleLoading ? () => <LoadingSpinner /> : undefined}
    />
  );
}
