import { fetchAllSchedules } from "@/lib/schedule";
import { useQuery } from "@tanstack/react-query";

export const useSchedule = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["schedule", startDate, endDate],
    queryFn: () => fetchAllSchedules(startDate, endDate),
    staleTime: 1000 * 60 * 60,
  });
};
