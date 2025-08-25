import { fetchUserInfo } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
