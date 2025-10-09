import Image from "next/image";
import CompanyBubble from "./_components/companyBubble";
import AlertBubble1 from "./_components/alertBubble1";
import AlertBubble2 from "./_components/alertBubble2";
import Link from "next/link";

export default function Home() {
  return (
    <div className="fixed flex flex-col justify-between top-0 left-0 w-full h-full bg-[linear-gradient(243.18deg,#FF9016_0%,#FFFFFF_59.99%,#FFE8CC_100%)]">
      <Link
        href="/login"
        className="absolute right-[3.25rem] top-[2.563rem] text-2xl text-white"
      >
        시작하기
      </Link>
      <div>
        <h1 className="text-[2.5rem] text-[#FF9016] font-semibold text-center mt-[6.438rem]">
          Jobnote
        </h1>
        <h2 className="text-[2.5rem] text-[#485C8B] font-semibold text-center mt-[1.75rem]">
          이력서 관리부터 최종합격까지 <br /> 잡노트와 함께라면 가능해!
        </h2>
      </div>
      <CompanyBubble />
      <AlertBubble1 />
      <AlertBubble2 />

      <div className="relative w-[63.188rem] aspect-[16/9] mx-auto">
        <Image
          priority
          src="/splash1.png"
          alt="splash"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
