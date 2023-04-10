"use client";

import { Session } from "next-auth"; // Session is a type that represents the user's session
import { signIn } from "next-auth/react"; // signIn is a function that will redirect the user to the sign in page
import Image from "next/image"; // Image is a component that will lazy load images
import Link from "next/link"; // Link is a component that will prefetch pages
import Cart from "./Cart"; // Import the Cart component
import { useCartStore } from "@/store"; // Import the useCartStore hook
import { AiFillShopping } from "react-icons/ai"; // Import the shopping cart icon

// Navigation bar
export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <nav className="flex justify-between items-center py-12">
      <Link href={"/"}>
        <h1>Styled</h1>
      </Link>
      <ul className="flex items-center gap-12">
        {/* Toggle the cart */}
        <li
          onClick={() => cartStore.toggleCart()}
          className="flex items-center text-3xl relative cursor-pointer"
        >
          <AiFillShopping />
          <span className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center">
            {cartStore.cart.length}
          </span>
          {/* If the user is not signed in */}
        </li>
        {!user && ( // Show if user is not signed in
          <li className="bg-teal-600 text-white py-2 px-4 rounded-md">
            <button onClick={() => signIn()}>Sign In</button>
          </li>
        )}
        {user && ( // Show if user is signed in
          <Image
            src={user?.image as string}
            alt={user.name as string}
            width={36}
            height={36}
            className="rounded-full"
          />
        )}
      </ul>
      {cartStore.isOpen && <Cart />}
    </nav>
  );
}
