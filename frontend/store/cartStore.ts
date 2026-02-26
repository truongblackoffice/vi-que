import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    seller_id: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (product_id: number) => void;
    updateQuantity: (product_id: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.product_id === item.product_id);
                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, item] });
                }
            },
            removeItem: (product_id) =>
                set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),
            updateQuantity: (product_id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) => (i.product_id === product_id ? { ...i, quantity } : i)),
                })),
            clearCart: () => set({ items: [] }),
            getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
        }),
        {
            name: 'vique-cart-storage',
        }
    )
);
