import { Schedule } from "@/type/applicationType";
import { NextResponse } from "next/server";

interface CompanyApplication {
  status: "APPLIED" | "DOCUMENT_PASSED" | "FINAL_PASSED" | "REJECTED" | string;
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

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization");
    const startDate = new Date().toISOString();
    const endDate = new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString();

    const apiUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/application-forms`
    );

    const [applicationResponse, scheduleResponse] = await Promise.all([
      fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/schedules?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
        }
      ),
    ]);

    if (!applicationResponse.ok) {
      throw new Error(
        `Failed to fetch applications: ${applicationResponse.statusText}`
      );
    }
    if (!scheduleResponse.ok) {
      throw new Error(
        `Failed to fetch schedules: ${scheduleResponse.statusText}`
      );
    }

    const applicationData = await applicationResponse.json();
    const scheduleData = await scheduleResponse.json();

    const applications: CompanyApplication[] = applicationData.data.content;
    const schedules = scheduleData.data.content;
    const refinedSchedules = schedules.map(
      (schedule: Schedule) => ({
        id: schedule.id,
        title: schedule.title,
        dateTime: schedule.dateTime,
        dday: getDDay(schedule.dateTime),
      })
    );

    const counts = {
      APPLIED: 0,
      DOCUMENT_PASSED: 0,
      FINAL_PASSED: 0,
      REJECTED: 0,
    };

    if (Array.isArray(applications)) {
      applications.forEach((app: CompanyApplication) => {
        if (app.status === "APPLIED") counts.APPLIED += 1;
        else if (app.status === "DOCUMENT_PASSED") counts.DOCUMENT_PASSED += 1;
        else if (app.status === "FINAL_PASSED") counts.FINAL_PASSED += 1;
        else if (app.status === "REJECTED") counts.REJECTED += 1;
      });
    }

    return NextResponse.json({
      applicationStatusCounts: counts,
      scheduleData: refinedSchedules,
    });
  } catch (error) {
    console.error("API Route Error:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
