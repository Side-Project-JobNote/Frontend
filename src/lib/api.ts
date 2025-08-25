// lib/axios.js
import axios from "axios";
import { reissue } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ★★★ 쿠키를 자동으로 보내기 위한 필수 옵션
});

// 응답 인터셉터 (401 에러 처리)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // HttpOnly 쿠키이므로, 자바스크립트에서는 토큰 만료를 미리 알 수 없음.
    // 따라서 401 에러가 발생했을 때 토큰을 갱신하는 로직만 필요.
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh_token은 브라우저가 자동으로 보내므로, 별도로 전달할 필요 없음
        reissue();

        // 토큰 갱신 성공 후, 원래 요청을 다시 시도
        // 새 access_token은 서버의 Set-Cookie 응답 헤더를 통해 브라우저에 자동으로 저장됨
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // 리프레시 실패 시 로그인 페이지로 이동
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
