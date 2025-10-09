import { create } from "zustand";

interface ModalState {
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isModal: false,
  setIsModal: (isModal: boolean) => set({ isModal }),
}));
