import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,20}$/;
const passwordError =
  "비밀번호는 8~20자, 영문 대소문자, 숫자를 포함해야 합니다.";

export const joinFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("이메일 형식이 올바르지 않습니다."),

    nickname: z.string().min(1, "닉네임을 입력해주세요."),

    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .regex(passwordRegex, passwordError),

    password2: z.string().min(1, "비밀번호 확인을 입력해주세요."),

    firstAgree: z
      .boolean()
      .refine((val) => val === true, "서비스 이용 약관에 동의해주세요."),

    secondAgree: z
      .boolean()
      .refine((val) => val === true, "개인정보 수집 및 이용에 동의해주세요."),
  })
  .refine((data) => data.password === data.password2, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["password2"],
  });

export type JoinFormData = z.infer<typeof joinFormSchema>;

export const loginFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("이메일 형식이 올바르지 않습니다."),

    password: z.string()
      .min(1, "비밀번호를 입력해주세요.")
      .regex(passwordRegex, passwordError),
  });

export type LoginFormData = z.infer<typeof loginFormSchema>;
