import { create } from 'zustand';

interface CartModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useCartModal = create<CartModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useCartModal;