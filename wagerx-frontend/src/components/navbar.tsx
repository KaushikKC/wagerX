"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Dialog } from "@headlessui/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentAddress, setAgentAddress] = useState("");
  const { account, connected, wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(connected, "con");
  const pathname = usePathname();
  const isActiveLink = (href: string) => pathname === href;
  console.log(account, "acc");

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleCreateAgent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!connected || !account?.address || !wallet) {
        throw new Error("Wallet not connected");
      }

      if (!agentAddress) {
        throw new Error("Please enter an agent address");
      }

      const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS;
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

      // Get the private key (Note: This might not be directly accessible due to security)
      // You might need to handle this differently based on your wallet implementation
      // const privateKey = await signMessage({
      //   message: "Authorize AI Agent",
      //   nonce: Date.now().toString(),
      // });

      const response = await fetch(
        "http://localhost:3001/api/ai/agent-authorize",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerAddress: ownerAddress,
            agentAddress: agentAddress,
            isAuthorized: true,
            privateKey: privateKey,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create agent");
      }

      const data = await response.json();
      console.log("Agent created successfully:", data);

      // Close modal and reset form
      setIsAgentModalOpen(false);
      setAgentAddress("");

      // You might want to show a success message
      // toast.success("Agent created successfully");
    } catch (err) {
      console.error("Error creating agent:", err);
      setError(err instanceof Error ? err.message : "Failed to create agent");
    } finally {
      setIsLoading(false);
    }
  };

  const navLinks = [
    { href: "/markets", label: "MARKETS" },
    { href: "/portfolio", label: "PORTFOLIO" },
    { href: "/leaderboard", label: "LEADERBOARD" },
    { href: "/proposals", label: "CREATE MARKET" },
    { href: "/profile", label: "PROFILE" },
  ];

  return (
    <>
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
              {connected && (
                <button
                  onClick={() => setIsAgentModalOpen(true)}
                  className="bg-[#AD1AAF] text-white px-4 py-2 rounded-lg 
                transition-all duration-300 hover:bg-[#8c158e] hover:shadow-lg 
                hover:scale-105 font-oxanium text-sm mr-5"
                >
                  Create Agent
                </button>
              )}
              <div className="shape-container">
                <div className="right-bar" />
              </div>

              <WalletSelector />

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
              {!connected && (
                <button
                  onClick={() => setIsAgentModalOpen(true)}
                  className="w-full bg-[#AD1AAF] text-white px-6 py-3 text-base font-medium 
                rounded-lg transition-all duration-300 hover:bg-[#8c158e] hover:shadow-lg 
                hover:scale-105 font-oxanium"
                >
                  Create Agent
                </button>
              )}
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
      {/* Create Agent Modal */}
      <Dialog
        open={isAgentModalOpen}
        onClose={() => {
          setIsAgentModalOpen(false);
          setError(null);
        }}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-bold text-white mb-4 font-oxanium">
              Create Agent
            </Dialog.Title>

            <div className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={agentAddress}
                onChange={(e) => setAgentAddress(e.target.value)}
                placeholder="Enter agent address"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white rounded-lg 
                border border-gray-600 focus:border-[#AD1AAF] focus:outline-none
                transition-colors duration-200 disabled:opacity-50"
              />

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setIsAgentModalOpen(false);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-300 hover:text-white 
                  transition-colors duration-200 font-oxanium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#AD1AAF] text-white rounded-lg 
                  transition-all duration-300 hover:bg-[#8c158e] hover:shadow-lg 
                  hover:scale-105 font-oxanium disabled:opacity-50 disabled:hover:scale-100
                  flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
