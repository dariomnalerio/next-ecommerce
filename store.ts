import { create } from "zustand"; // Import create from zustand, creates store instance
import { persist } from "zustand/middleware"; // Import persist middleware
import { AddCartType } from "./types/AddCartType";
import { Theme } from "next-auth";

// Cart item type
type CartState = {
  isOpen: boolean;
  cart: AddCartType[];
  toggleCart: () => void;
  clearCart: () => void;
  addProduct: (item: AddCartType) => void;
  removeProduct: (item: AddCartType) => void;
  paymentIntent: string;
  onCheckout: string;
  setPaymentIntent: (val: string) => void;
  setCheckout: (val: string) => void;
};

// Cart store with persist middleware
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      paymentIntent: "",
      onCheckout: "cart",
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })), // Open or close the cart
      addProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          ); // Check if item already exists in cart
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return { ...cartItem, quantity: cartItem.quantity! + 1 }; // If item exists, update quantity
              }
              return cartItem; // If item doesn't exist, return the cart item
            });
            return { cart: updatedCart }; // Return updated cart
          } else {
            return { cart: [...state.cart, { ...item, quantity: 1 }] }; // If item doesn't exist, add it to the cart
          }
        }),
      removeProduct: (item) =>
        // Checks if the item exists and removes it from the cart
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem && existingItem.quantity! > 1) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return { ...cartItem, quantity: cartItem.quantity! - 1 }; // If item exists, update quantity
              }
              return cartItem; // If item doesn't exist, return the cart item
            });
            return { cart: updatedCart }; // Return updated cart
          } else {
            // If quantity <= 0, remove the item from the cart // If quantity <= 0, remove the item from the cart
            const filteredCart = state.cart.filter(
              (cartItem) => cartItem.id !== item.id
            );
            return { cart: filteredCart };
          }
        }),
      setPaymentIntent: (val) => set((state) => ({ paymentIntent: val })),
      setCheckout: (val) => set((state) => ({ onCheckout: val })),
      clearCart: () => set((state) => ({ cart: [] })),
    }),
    { name: "cart-store" }
  )
);

type ThemeState = {
  mode: "light" | "dark";
  toggleMode: (theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      toggleMode: (theme) => set((state) => ({ mode: theme })),
    }),
    { name: "theme-store" }
  )
);
