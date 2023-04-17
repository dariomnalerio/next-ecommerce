"use client";

import { Session } from "next-auth"; // Session is a type that represents the user's session
import { signIn, signOut } from "next-auth/react"; // signIn is a function that will redirect the user to the sign in page
import Image from "next/image"; // Image is a component that will lazy load images
import Link from "next/link"; // Link is a component that will prefetch pages
import Cart from "./Cart"; // Import the Cart component
import { useCartStore } from "@/store"; // Import the useCartStore hook
import { AiFillShopping } from "react-icons/ai"; // Import the shopping cart icon
import { motion, AnimatePresence } from "framer-motion";
import { IoTrailSignOutline } from "react-icons/io5";
import DarkLight from "./DarkLight";

// Navigation bar
export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <nav className="flex justify-between items-center py-12">
      <Link href={"/"}>
        <h1>Styled</h1>
      </Link>
      <ul className="flex items-center gap-8">
        {/* Toggle the cart */}
        <li
          onClick={() => cartStore.toggleCart()}
          className="flex items-center text-3xl relative cursor-pointer"
        >
          <AiFillShopping />
          <AnimatePresence>
            {cartStore.cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-primary text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center"
              >
                {cartStore.cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          {/* If the user is not signed in */}
        </li>
        {/* Dark mode */}
        <DarkLight />
        {!user && ( // Show if user is not signed in
          <li className="bg-primary text-white py-2 px-4 rounded-md">
            <button onClick={() => signIn()}>Sign In</button>
          </li>
        )}
        {user && ( // Show if user is signed in
          <li>
            <div className="dropdown dropdown-end cursor-pointer">
              <Image
                tabIndex={0}
                src={user?.image as string}
                alt={user.name as string}
                width={36}
                height={36}
                className="rounded-full"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu p-4 space-y-4 shadow bg-base-100 rounded-box w-72"
              >
                <Link
                  className="hover:bg-base-300 p-4 rounded-md"
                  href={"/dashboard"}
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  Orders
                </Link>
                <li
                  className="hover:bg-base-300 p-4 rounded-md"
                  onClick={() => {
                    signOut();
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  Sign out
                </li>
              </ul>
            </div>
          </li>
        )}
      </ul>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
