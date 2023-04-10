"use client";
import { useCartStore } from "@/store";
import { AddCartType } from "@/types/AddCartType";
import { useState } from "react";

export default function AddCart({
  name,
  id,
  unit_amount,
  quantity,
  image,
}: AddCartType) {
  const cartStore = useCartStore();
  const [added, setAdded] = useState(false);

  return (
    <>
      <button
        onClick={() =>
          cartStore.addProduct({ id, image, unit_amount, quantity, name }) // Add product to cart
        }
        className="my-12 text-white py-2 px-6 font-medium rounded-md bg-teal-700"
      >
        Add to cart
      </button>
    </>
  );
}
