import { Roboto } from "next/font/google";
import MainDocuments from "./_components/mainDocuments";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export default function DocumentsPage() {
  return (
    <>
      <div
        className={`${roboto.className} flex flex-row justify-between items-center mt-8`}
      >
        <h2 className="text-3xl font-medium">나의 문서 목록</h2>
      </div>
      <MainDocuments />
    </>
  );
}
