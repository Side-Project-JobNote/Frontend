import ScheduleSection from "./_components/scheduleSection";
import ApplicationStatusSection from "./_components/applicationStatusSection";

export default function DashboardPage() {
  return (
    <>
      <ApplicationStatusSection />
      <ScheduleSection />
    </>
  );
}
