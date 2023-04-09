"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// Navigation bar
export default function Nav({ user }: Session) {
  return (
    <nav className="flex justify-between items-center py-8">
      <Link href={"/"}>
      <h1>Styled</h1>
      </Link>
      <ul className="flex items-center gap-12">
        {!user && ( // Show if user is not signed in
          <li className="bg-teal-600 text-white py-2 px-4 rounded-md">
            <button onClick={() => signIn()}>Sign In</button>
          </li>
        )}
        {user && ( // Show if user is signed in
          <Image
          src={user?.image as string}
          alt={user.name as string}
          width={48}
          height={48}
          className="rounded-full"
          />
          )}
      </ul>
    </nav>
  );
}
