"use client";

import React, { useState } from "react";
import EmptyCheckCircle from "@/assets/EmptyCheckCircle.svg";
import FilledCheckCircle from "@/assets/FilledCheckCircle.svg";
import EyeInvisible from "@/assets/EyeInvisible.svg";
import PrivacyPolicy from "./PrivacyPolicy";
import ServiceTermsSection from "./ServiceTermsSection";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useSignUp } from "@/hooks/useAuth";
import { joinFormSchema } from "@/lib/schemas/authSchema";
import { JoinFormData } from "@/lib/schemas/authSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function JoinForm() {
  const router = useRouter();
  const { mutate, isPending } = useSignUp();
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [showServiceTerms, setShowServiceTerms] = useState(false);
  const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      password2: "",
      firstAgree: false,
      secondAgree: false,
    },
  });

  const onSubmit: SubmitHandler<JoinFormData> = (data) => {
    const { email, nickname, password } = data;

    mutate(
      { email, password, nickname },
      {
        onSuccess: () => {
          alert("인증 메일을 발송했습니다. 메일함을 확인해주세요.");
          router.replace("/login");
        },
        onError: (err) => {
          const error = err as AxiosError<{ message: string }>;
          const message = error.response?.data?.message;

          switch (message) {
            case "이미 가입된 이메일입니다.":
              alert("이미 가입된 이메일입니다.");
              break;
            case "이미 사용중인 닉네임입니다.":
              alert("이미 사용중인 닉네임입니다.");
            default:
              break;
          }
        },
      }
    );
  };

  const firstAgree = watch("firstAgree");
  const secondAgree = watch("secondAgree");
  const allAgree = firstAgree && secondAgree;

  const toggleAllAgree = () => {
    const next = !allAgree;
    setValue("firstAgree", next, { shouldValidate: true });
    setValue("secondAgree", next, { shouldValidate: true });
  };
  const inputWrapper = "flex flex-col gap-2";
  const inputStyle = "border border-[#D9D9D9] rounded-xs h-8 px-2";
  const checkBoxWrapper = "flex flex-row justify-between";
  const checkBox = "flex flex-row items-center gap-1";
  const checkButton = "hover:cursor-pointer";

  return (
    <form
      className="flex flex-col w-full gap-4 text-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 이메일 */}
      <div className={inputWrapper}>
        <label htmlFor="id" className="text-[#424242]">
          <span className="text-[#FF4D4F]">*</span> id
        </label>
        <input
          type="text"
          id="id"
          className={inputStyle}
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>

      {/* 이름 */}
      <div className={inputWrapper}>
        <label htmlFor="name" className="text-[#424242]">
          <span className="text-[#FF4D4F]">*</span> name
        </label>
        <input
          type="text"
          id="name"
          placeholder="닉네임을 입력하세요."
          className={inputStyle}
          {...register("nickname")}
        />
        {errors.nickname && (
          <span className="text-red-500">{errors.nickname.message}</span>
        )}
      </div>

      {/* 비밀번호 */}
      <div className={inputWrapper}>
        <label htmlFor="pw" className="text-[#424242]">
          <span className="text-[#FF4D4F]">*</span> password
        </label>
        <input
          type="password"
          id="password"
          className={inputStyle}
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        {/* 비밀번호 확인 */}
        <div className="relative flex flex-row items-center">
          <input
            disabled={!watch("password")}
            type={isVisiblePassword ? "text" : "password"}
            id="password2"
            className={inputStyle + " w-full " + (!watch("password") ? "bg-[#F5F5F5]" : "")}
            {...register("password2")}
          />
          <button
            type="button"
            className="absolute right-2"
            onClick={() => setIsVisiblePassword((prev) => !prev)}
          >
            <EyeInvisible />
          </button>
        </div>
        {errors.password2 && (
          <span className="text-red-500">{errors.password2.message}</span>
        )}
      </div>

      <div className={checkBox + " mt-4"}>
        <label
          htmlFor="all-agree"
          onClick={toggleAllAgree}
          className={checkButton + " flex items-center gap-1"}
        >
          {allAgree ? <FilledCheckCircle /> : <EmptyCheckCircle />}
          <span>전체동의</span>
        </label>
        <input type="checkbox" id="all-agree" className="hidden" />
      </div>

      {/* (필수) 서비스 이용약관 동의 */}
      <div>
        <div className={checkBoxWrapper}>
          <label
            className={`${checkBox} ${checkButton}`}
          >
            {firstAgree ? <FilledCheckCircle /> : <EmptyCheckCircle />}
            <span>
              <span className="text-[#FF9016]">(필수)</span> 서비스 이용 약관
              동의
            </span>
            <input
              type="checkbox"
              {...register("firstAgree")}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowServiceTerms((prev) => !prev)}
            className="underline text-[0.5rem] text-[#747474]"
          >
            {showServiceTerms ? "접기" : "보기"}
          </button>
        </div>
        {errors.firstAgree && (
          <span className="text-red-500">{errors.firstAgree.message}</span>
        )}
        <div
          className={`overflow-y-scroll transition-all duration-300 ease-in-out custom-scrollbar rounded-sm ${
            showServiceTerms
              ? "max-h-[22.5rem] opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <ServiceTermsSection />
        </div>
      </div>

      {/* (필수) 개인정보 수집 및 이용 동의 */}
      <div>
        <div className={checkBoxWrapper}>
          <label
            className={`${checkBox} ${checkButton}`}
          >
            {secondAgree ? <FilledCheckCircle /> : <EmptyCheckCircle />}
            <span>
              <span className="text-[#FF9016]">(필수)</span> 개인정보 수집 및
              이용 동의
            </span>
            <input
              type="checkbox"
              {...register("secondAgree")}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowPrivacyTerms((prev) => !prev)}
            className="underline text-[0.5rem] text-[#747474]"
          >
            {showPrivacyTerms ? "접기" : "보기"}
          </button>
        </div>
        {errors.secondAgree && (
          <span className="text-red-500">{errors.secondAgree.message}</span>
        )}
        <div
          className={`overflow-y-scroll transition-all duration-300 ease-in-out custom-scrollbar rounded-sm ${
            showPrivacyTerms
              ? "max-h-[22.5rem] opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <PrivacyPolicy />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || isPending}
        className={`w-full h-8 rounded-xs shadow-[0_2px_0_rgba(0,0,0,0.043)] ${
          !isValid || isPending
            ? "border border-[#D9D9D9] bg-gray-200 cursor-not-allowed"
            : "bg-[#FF9016] text-white"
        }`}
      >
        {isPending ? "가입 요청 중..." : "회원가입"}
      </button>
    </form>
  );
}
