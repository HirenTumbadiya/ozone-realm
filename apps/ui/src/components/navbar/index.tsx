"use client";

import Link from "next/link";
import { useState } from "react";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="text-white flex items-center justify-between px-6 sm:px-10 py-4 w-full fixed top-0 z-10 bg-white/10 backdrop-blur">
      <h1 className="text-4xl sm:text-6xl font-bold">OZONE-REALM</h1>
      <div className="hidden sm:flex gap-10 text-xl items-center">
        <ul className="flex gap-10">
          {["/", "/about", "/docs"].map((path, index) => (
            <li key={index} className="animated_text group relative">
              <Link href={path} className="inline-block">
                <span className="relative z-10">
                  {path === "/" ? "HOME" : path.substring(1).toUpperCase()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <SignedOut>
          <SignInButton>
            <button className="animated_text group relative">LOGIN</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Mobile Menu */}

      <div className="sm:hidden flex items-center gap-4">
        <button className="text-xl" onClick={toggleMenu}>
          <RiMenu3Line />
        </button>
      </div>
      <div
        className={`sm:hidden fixed top-0 right-0 w-screen h-screen z-20 flex justify-center items-center bg-black/80 backdrop-blur py-4 px-6 transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 w-full max-w-xs bg-black/90 p-8 rounded-lg relative">
          <button
            onClick={toggleMenu}
            className="text-2xl text-white absolute top-4 right-4"
          >
            <RiCloseLine />
          </button>

          {["/", "/about", "/docs"].map((path, index) => (
            <Link key={index} href={path} className="text-xl text-white">
              {path === "/" ? "HOME" : path.substring(1).toUpperCase()}
            </Link>
          ))}

          <SignedOut>
            <SignInButton>
              <button className="text-xl text-white">LOGIN</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
