"use client";

import Image from "next/image"; // Image is a component that will lazy load images
import { useCartStore } from "@/store"; // Import the useCartStore hook
import formatPrice from "@/util/PriceFormat"; // Import the price formatter
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5"; // Import the add and remove icons
import basket from "@/public/basket.png";

// Cart component
export default function Cart() {
  const cartStore = useCartStore();

  // Total price
  // Reduce the cart array to a single value
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0); // Starting value

  return (
    <div
      onClick={() => cartStore.toggleCart()}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-700"
      >
        <h1>Here's your shopping list 📃</h1>
        {cartStore.cart.map(
          (
            item // Maps through the cart array
          ) => (
            <div className="flex py-4 gap-4">
              <Image
                className=" rounded-md h-24"
                src={item.image}
                alt={item.name}
                width={120}
                height={120}
              />
              <div>
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
              </div>
            </div>
          )
        )}
        {/* Checkout and total */}
        {cartStore.cart.length > 0 && <p>Total: {formatPrice(totalPrice)}</p>}
        {cartStore.cart.length <= 0 && <></>} {/* If cart is empty, display nothing */}
        {cartStore.cart.length > 0 && (
          <button className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">
            Checkout
          </button>
        )}
        {!cartStore.cart.length && (
          <div className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75">
            <h1>Uhh ohh... it's empty 😢</h1>
            <Image src={basket} alt={"empty cart"} width={200} height={200} />
          </div>
        )}
      </div>
    </div>
  );
}
