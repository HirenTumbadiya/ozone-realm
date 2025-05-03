"use client";
import Navbar from "@/components/navbar";
import CustomCursor from "@/components/CustomCursor";
import { usePathname } from "next/navigation";
import GridLayout from "@/components/gridLayout";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/auth") || pathname.startsWith("/game");

  return (
    <>
      <CustomCursor />
      <GridLayout>
        {!hideNavbar && <Navbar />}
        {children}
      </GridLayout>
    </>
  );
}
