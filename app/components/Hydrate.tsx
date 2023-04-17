"use client";

// ReactNode is a type that represents any React element
// useEffect is a hook that will run a function when the component mounts
// useState is a hook that will create a state variable
import { ReactNode, useEffect, useState } from "react";
import { useThemeStore } from "@/store";

export default function Hydrate({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false); // Create a state variable to determine if the component is hydrated
  const themeStore = useThemeStore(); // Get the theme store

  // Wait till Nextjs rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <>
      {isHydrated ? (
        <body className="px-4 lg:px-48 font-roboto" data-theme={themeStore.mode}>
          {children}
        </body>
      ) : (
        <body></body>
      )}
    </>
  );
}
