"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { login } from "@/lib/auth";
import EyeInvisible from "@/assets/EyeInvisible.svg";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // 규칙: 8~20자, 영문 대소문자, 숫자 포함, 특수문자는 option
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,20}$/;
    return passwordRegex.test(password);
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
    } else if (!validateEmail(email)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailError("");
    }
  };

  const passwordBlur = () => {
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
    } else if (!validatePassword(password)) {
      setPasswordError("비밀번호 형식이 올바르지 않습니다.");
    } else setPasswordError("");
  };

  const isDisabled = !email || !validateEmail(email) || !password;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, password)
      .then(() => {
        router.replace("/dashboard");
      })
      .catch((err) => {
        const error = err as AxiosError<{ message: string }>; // AxiosError 타입 지정
        const message = error.response?.data?.message;
        if (message === "아이디 또는 비밀번호가 잘못되었습니다.") {
          alert("아이디 또는 비밀번호가 잘못되었습니다.");
        }
      });
  };

  return (
    <form
      id="login-form"
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <label htmlFor="id" className="text-[#BDBDBD] text-xs">
        id
      </label>
      <input
        id="id"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value.trim());
          setEmailError("");
        }}
        onBlur={handleEmailBlur}
        className={`w-66 h-8 border border-[#D9D9D9] rounded-sm text-sm text-[#424242] pl-3 ${
          emailError ? "border-[#FA4343] shadow-[0_0_0_2px_#fa434333]" : ""
        }`}
        required
      />
      <p className="text-xs text-[#FA4343]">{emailError ? emailError : ""}</p>

      <label htmlFor="password" className="text-[#BDBDBD] text-xs">
        password
      </label>
      <div id="password-input" className="relative flex items-center">
        <input
          id="password"
          type={isVisiblePassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value.trim());
            setPasswordError("");
          }}
          onBlur={passwordBlur}
          className={`w-66 h-8 border border-[#D9D9D9] rounded-sm text-sm text-[#424242] pl-3 pr-6 ${
            passwordError ? "border-[#FA4343] shadow-[0_0_0_2px_#fa434333]" : ""
          }`}
          required
        />
        <button
          type="button"
          className="absolute right-2 size-3.5"
          onClick={() => {
            setIsVisiblePassword((prev) => !prev);
          }}
        >
          <EyeInvisible />
        </button>
      </div>

      <div className="flex flex-row justify-between mb-4">
        <span className="text-xs text-[#FA4343]">
          {passwordError ? passwordError : ""}
        </span>

        <Link href="login/find-password" className="text-[8px] text-[#616161]">
          비밀번호 찾기
        </Link>
      </div>

      <button
        type="submit"
        className={`w-66 h-8   rounded-xs shadow-[0_2px_0_rgba(0,0,0,0.043)] ${
          isDisabled ? "border border-[#D9D9D9]" : "bg-[#FF9016] text-white"
        }`}
        disabled={isDisabled}
      >
        login
      </button>
    </form>
  );
}

