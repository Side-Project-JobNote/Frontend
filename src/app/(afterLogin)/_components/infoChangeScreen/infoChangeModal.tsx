"use client";

import CloseIcon from "@/assets/Close.svg";
import SelectSection from "./selectSection";
import { useModalStore } from "@/store/modalStore";

export default function InfoChangeModal() {
  const { isModal, setIsModal } = useModalStore();
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isModal ? "block" : "hidden"
      }`}
    >
      <div
        onClick={() => {
          setIsModal(false);
        }}
        className="absolute inset-0 bg-black opacity-20"
      ></div>

      <div className="relative w-96 h-72 bg-white z-50 p-4 rounded-lg shadow-lg">
        <button
          className="absolute right-4"
          onClick={() => {
            setIsModal(false);
          }}
        >
          <CloseIcon width={24} />
        </button>
        <SelectSection />
      </div>
    </div>
  );
}
