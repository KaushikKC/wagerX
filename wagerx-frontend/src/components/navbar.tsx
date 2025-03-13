"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActiveLink = (href: string) => pathname === href;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/markets", label: "MARKETS" },
    { href: "/portfolio", label: "PORTFOLIO" },
    { href: "/leaderboard", label: "LEADERBOARD" },
    { href: "/proposals", label: "CREATE MARKET" },
    { href: "/profile", label: "PROFILE" },
  ];

  return (
    <nav className="relative mb-10">
      <div
        className="absolute inset-0 bg-cover bg-center h-screen"
        style={{
          backgroundImage: "url('/images/Vector.png')",
        }}
      />

      {/* Navbar content */}
      <div className="relative mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-5 pt-[42px] 2xl:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-transform duration-200 hover:scale-105"
        >
          <span className="text-2xl sm:text-3xl font-lato text-white font-semibold">
            WAGER
          </span>
          <span className="text-4xl sm:text-5xl font-lato text-white font-semibold">
            X
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white hover:text-gray-300 transition-colors z-50"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:block bg-gradient-to-b from-white/10 h-[80px] items-center px-5">
          <div className="flex items-center gap-6 xl:gap-10 pt-[32px]">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm xl:text-base font-medium font-oxanium transition-all duration-200
                  ${
                    isActiveLink(href)
                      ? "text-white font-bold scale-105 border-b-2 border-[#AD1AAF] pb-1"
                      : "text-gray-200 hover:text-white hover:scale-105"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Right side buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center">
            <div className="shape-container">
              <div className="right-bar" />
            </div>
            <WalletSelector />
            {/* <button
              className="relative mx-1 bg-[#AD1AAF] text-white px-4 xl:px-6 py-3 text-base xl:text-lg font-medium 
              transition-all duration-300 hover:bg-[#8c158e] hover:shadow-lg hover:scale-105 h-[55px]"
            >
              <div className="first-bar" />
              <span className="relative z-10 font-oxanium whitespace-nowrap">
                Connect Wallet
              </span>
              <div className="last-bar" />
            </button> */}
            <div className="shape-container">
              <div className="right-bar" />
            </div>
          </div>
          {/* <Link 
            href="/profile"
            className="transition-transform duration-200 hover:scale-110"
          >
            <UserCircle className="h-8 w-8 xl:h-10 xl:w-10 text-gray-400 hover:text-white transition-colors" />
          </Link> */}
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed top-[90px] right-4 w-[280px] bg-black/95 rounded-xl 
    backdrop-blur-lg border border-white/10 shadow-xl z-40 
    transition-all duration-300 ease-in-out transform
    ${
      isOpen
        ? "opacity-100 visible translate-y-0"
        : "opacity-0 invisible -translate-y-4"
    }`}
        >
          <div className="flex flex-col items-start p-6 gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-base w-full font-medium font-oxanium transition-all duration-200
          ${
            isActiveLink(href)
              ? "text-white font-bold scale-105 border-b-2 border-[#AD1AAF] pb-1"
              : "text-gray-200 hover:text-white hover:scale-105"
          }`}
              >
                {label}
              </Link>
            ))}
            <WalletSelector />
            <button
              className="w-full bg-[#AD1AAF] text-white px-6 py-3 text-base font-medium 
      rounded-lg transition-all duration-300 hover:bg-[#8c158e] hover:shadow-lg 
      hover:scale-105 font-oxanium"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
