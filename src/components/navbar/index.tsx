"use client";
import Link from "next/link";
import { useState } from "react";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="text-white flex items-center justify-between px-6 sm:px-10 py-4 w-full fixed top-0 z-10 bg-white/10 backdrop-blur">
      <h1 className="text-4xl sm:text-6xl font-bold">OZONE-REALM</h1>

      {/* Menu for larger screens */}
      <div className="hidden sm:flex gap-10 text-xl">
        <ul className="flex gap-10">
          <ol className="animated_text group relative">
            <Link href={"/"} className="inline-block">
              <span className="relative z-10">HOME</span>
            </Link>
          </ol>
          <ol className="animated_text group relative">
            <Link href={"/about"} className="inline-block">
              <span className="relative z-10">ABOUT</span>
            </Link>
          </ol>
          <ol className="animated_text group relative">
            <Link href={"/marketplace"} className="inline-block">
              <span className="relative z-10">MARKETPLACE</span>
            </Link>
          </ol>
          <ol className="animated_text group relative">
            <Link href={"/docs"} className="inline-block">
              <span className="relative z-10">DOCS</span>
            </Link>
          </ol>
        </ul>
        <button className="animated_text group relative">LOGIN</button>
      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden flex items-center gap-4">
        <button className="text-xl" onClick={toggleMenu}>
          <span className="material-icons"><RiMenu3Line /></span>
        </button>
      </div>

      <div
        className={`sm:hidden fixed top-0 right-0 w-screen h-screen z-20 flex justify-center items-center bg-black/80 backdrop-blur py-4 px-6 transition-all duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col gap-6 w-full max-w-xs bg-black/90 p-8 rounded-lg">
          {/* Close button */}
          <button
            onClick={toggleMenu}
            className="text-2xl text-white absolute top-4 right-4"
          >
            <RiCloseLine />
          </button>

          {/* Menu links */}
          <Link href={"/"} className="text-xl text-white">HOME</Link>
          <Link href={"/about"} className="text-xl text-white">ABOUT</Link>
          <Link href={"/marketplace"} className="text-xl text-white">MARKETPLACE</Link>
          <Link href={"/docs"} className="text-xl text-white">DOCS</Link>
          <button className="text-xl text-white">LOGIN</button>
        </div>
      </div>

    </nav>
  );
}
