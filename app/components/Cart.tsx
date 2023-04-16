"use client";

import Image from "next/image"; // Image is a component that will lazy load images
import { useCartStore } from "@/store"; // Import the useCartStore hook
import formatPrice from "@/util/PriceFormat"; // Import the price formatter
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5"; // Import the add and remove icons
import basket from "@/public/basket.png";
import { motion as motion, AnimatePresence } from "framer-motion";
import Checkout from "./Checkout,";

// Cart component
export default function Cart() {
  const cartStore = useCartStore();

  // Total price
  // Reduce the cart array to a single value
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0); // Starting value

  return (
    // Background
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      {/* Cart */}
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-white absolute right-0 top-0 h-screen p-12 overflow-y-scroll text-gray-700 w-full lg:w-2/5"
      >
        {cartStore.onCheckout === "cart" && (
          <button
            onClick={() => cartStore.toggleCart()}
            className="text-sm font-bold pb-12"
          >
            Back to store 🏃
          </button>
        )}
        {cartStore.onCheckout === "checkout" && (
          <button
            onClick={() => cartStore.setCheckout("cart")}
            className="text-sm font-bold pb-12"
          >
            Check your cart 🛒
          </button>
        )}
        {/* Cart items (should just render out if onCheckout === 'cart')*/}
        {cartStore.onCheckout === "cart" && (
          <>
            {cartStore.cart.map(
              (
                item // Maps through the cart array
              ) => (
                <motion.div layout key={item.id} className="flex py-4 gap-4">
                  <Image
                    className=" rounded-md h-24"
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                  />
                  <motion.div layout>
                    <h2>{item.name}</h2>
                    {/* Update quantity of a product */}
                    <div className="flex gap-2">
                      <h2>Quantity: {item.quantity}</h2>
                      <button
                        onClick={() =>
                          cartStore.removeProduct({
                            name: item.name,
                            id: item.id,
                            quantity: item.quantity,
                            image: item.image,
                            unit_amount: item.unit_amount,
                          })
                        }
                      >
                        <IoRemoveCircle />
                      </button>
                      <button
                        onClick={() =>
                          cartStore.addProduct({
                            name: item.name,
                            id: item.id,
                            quantity: item.quantity,
                            image: item.image,
                            unit_amount: item.unit_amount,
                          })
                        }
                      >
                        <IoAddCircle />
                      </button>
                    </div>
                    <p className="text-sm">
                      {item.unit_amount && formatPrice(item.unit_amount)}
                    </p>{" "}
                    {/* If price is null, display N/A, else display price */}
                  </motion.div>
                </motion.div>
              )
            )}
          </>
        )}
        {/* Checkout and total */}
        {/* Only render checkout if cart is not empty */}
        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" ? (
          <motion.div layout>
            <p>Total: {formatPrice(totalPrice)}</p>
            <button
              onClick={() => cartStore.setCheckout("checkout")}
              className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white"
            >
              Checkout
            </button>
          </motion.div>
        ) : null}
        {/* Checkout form */}
        {cartStore.onCheckout === "checkout" && <Checkout />}
        <AnimatePresence>
          {!cartStore.cart.length && (
            <motion.div
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              initial={{ scale: 0.5, rotateZ: -20, opacity: 0 }}
              exit={{ scale: 0.5, rotateZ: -20, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
            >
              <h1>Uhh ohh... it's empty 😢</h1>
              <Image src={basket} alt={"empty cart"} width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
