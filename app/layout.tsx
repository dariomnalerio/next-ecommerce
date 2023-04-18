import "./globals.css";
import Nav from "./components/Nav";
import { getServerSession } from "next-auth/next"; // Import the getServerSession function, which will fetch the user's session
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Import the authOptions object, which contains the NextAuth.js configuration
import Hydrate from "./components/Hydrate"; // Import the Hydrate component to prevent React hydration errors
import { Roboto, Lobster_Two } from "next/font/google";

// Define main font
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const lobster = Lobster_Two({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-lobster",
});

export const metadata = {
  title: "Next-ecommerce",
  description: "Next-ecommerce portfolio website",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the user
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${roboto.variable} ${lobster.variable}`}>
      <Hydrate>
        <Nav user={session?.user} expires={session?.expires as string} />
        {children}
      </Hydrate>
    </html>
  );
}
