"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { login } from "@/lib/auth";
import EyeInvisible from "@/assets/EyeInvisible.svg";
import { LoginFormData, loginFormSchema } from "@/lib/schemas/authSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const router = useRouter();
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    const { email, password } = data;
    login(email, password)
      .then(() => {
        router.replace("/dashboard");
      })
      .catch((err) => {
        const error = err as AxiosError<{ message: string }>;
        const message = error.response?.data?.message;
        if (message) {
          alert(message);
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      });
  };

  return (
    <form
      id="login-form"
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="id" className="text-[#BDBDBD] text-xs">
        id
      </label>
      <input
        id="id"
        type="text"
        {...register("email")}
        className={`w-full h-8 border border-[#D9D9D9] rounded-sm text-sm text-[#424242] pl-3 ${
          errors.email ? "border-[#FA4343] shadow-[0_0_0_2px_#fa434333]" : ""
        }`}
      />
      {errors.email && <p className="text-xs text-[#FA4343]">{errors.email.message}</p>}

      <label htmlFor="password" className="text-[#BDBDBD] text-xs">
        password
      </label>
      <div id="password-input" className="relative flex items-center">
        <input
          id="password"
          type={isVisiblePassword ? "text" : "password"}
          {...register("password")}
          className={`w-full h-8 border border-[#D9D9D9] rounded-sm text-sm text-[#424242] pl-3 pr-6 ${
            errors.password ? "border-[#FA4343] shadow-[0_0_0_2px_#fa434333]" : ""
          }`}
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
          {errors.password ? errors.password.message : ""}
        </span>

        <Link href="/login/find-password" className="text-[8px] text-[#616161]">
          비밀번호 찾기
        </Link>
      </div>

      <button
        type="submit"
        className={`w-full h-8   rounded-xs shadow-[0_2px_0_rgba(0,0,0,0.043)] ${
          !isValid ? "border border-[#D9D9D9]" : "bg-[#FF9016] text-white"
        }`}
        disabled={!isValid}
      >
        login
      </button>
    </form>
  );
}
