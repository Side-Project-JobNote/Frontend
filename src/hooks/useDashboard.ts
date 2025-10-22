import { fetchDashboard } from "@/lib/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
    staleTime: 1000 * 60 * 60,
  });
};
