"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import S from "@/images/s.png";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="relative mb-10">
      <div
        className="absolute inset-0 bg-cover bg-center h-screen"
        style={{
          backgroundImage: "url('/images/Vector.png')"
        }}
      />

      {/* Navbar content */}
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 pt-[42px]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-oxaniumbold text-white">PREDICT</span>
          <Image src={S} height={65} alt="Logo" />
        </Link>

        {/* Center Navigation */}
        <div className="bg-gradient-to-b from-white/10 h-[80px] items-center flex px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium font-oxaniummedium text-gray-200 transition-colors hover:text-white"
            >
              DASHBOARD
            </Link>
            <Link
              href="/markets"
              className="text-sm font-medium font-oxaniummedium text-gray-200 transition-colors hover:text-white"
            >
              MARKETS
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-medium font-oxaniummedium text-gray-200 transition-colors hover:text-white"
            >
              PORTFOLIO
            </Link>
            <Link
              href="/NFTMarket"
              className="text-sm font-medium font-oxaniummedium text-gray-200 transition-colors hover:text-white"
            >
              NFT MARKETPLACE
            </Link>
            <Link
              href="/proposals"
              className="text-sm font-medium font-oxaniummedium text-gray-200 transition-colors hover:text-white"
            >
              CREATE MARKET
            </Link>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="shape-container">
              <div className="right-bar" />
            </div>
            <button className="relative mx-1 bg-[#AD1AAF] text-white px-6 py-3 text-lg font-medium transition-all hover:bg-[#8c158e] hover:shadow-lg hover-shake h-[55px]">
              {/* Button Text */}
              <div className="first-bar" />
              <span className="relative z-10 font-oxaniummedium">
                Connect Wallet
              </span>
              <div className="last-bar" />
            </button>
            <div className="shape-container">
              <div className="right-bar" />
            </div>
          </div>
          <Link href="/profile">
            <UserCircle className="h-8 w-8 text-gray-400" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
