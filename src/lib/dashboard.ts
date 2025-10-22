import { useAuthStore } from "@/store/auth/authStore";
import axios from "axios";

export const fetchDashboard = async () => {
  const token = useAuthStore.getState().token;
  const res = await axios.get(`/api/dashboard`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
