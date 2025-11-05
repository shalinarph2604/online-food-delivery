import { create } from 'zustand';

interface CartModalStore {
    isOpen: boolean;
    restaurantId?: string;
    onOpen: (restaurantId: string) => void;
    onClose: () => void;
}

const useCartModal = create<CartModalStore>((set) => ({
    isOpen: false,
    restaurantId: undefined,
    onOpen: (restaurantId: string) => set({ isOpen: true, restaurantId }),
    onClose: () => set({ isOpen: false, restaurantId: undefined }),
}))

export default useCartModal;