import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 로그인 요청
export const login = async (email: string, password: string) => {
  const res = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return res;
};

// 리프레시 토큰 요청
export const reissue = async () => {
  const res = await axios.post(`${API_URL}/api/v1/users/reissue`, null, {
    withCredentials: true,
  });
  return res;
};

// 유저 정보 가져오기
export const fetchUserInfo = async () => {
  const res = await axios.get(`${API_URL}/api/v1/users/profile`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const naverLogin = () => {
  window.location.href = `${API_URL}/oauth2/authorization/naver`;
};
export const googleLogin = () => {
  window.location.href = `${API_URL}/oauth2/authorization/google`;
};
export const kakaoLogin = () => {
  window.location.href = `${API_URL}/oauth2/authorization/kakao`;
};
