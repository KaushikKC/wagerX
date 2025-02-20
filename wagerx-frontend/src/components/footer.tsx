"use client";

import React from "react";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const socialLinks: SocialLink[] = [
    { icon: FaXTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaGithub, href: "#", label: "Github" },
    { icon: FaFacebook, href: "#", label: "Facebook" }
  ];

  return (
    <footer className="relative py-8">
      {/* Gradient Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[400px] h-px bg-gradient-to-r from-transparent via-[#E861EA] to-transparent" />

      <div className="max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <h2 className="text-2xl font-bold font-oxanium bg-gradient-to-r from-[#F81DFB] to-[#E861EA] bg-clip-text text-transparent
            hover:scale-110 transition-transform duration-300">
            WagerX
          </h2>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2"
                aria-label={social.label}
              >
                {/* Hover Effect Background */}
                <span className="absolute inset-0 bg-[#E861EA]/0 rounded-full 
                  group-hover:bg-[#E861EA]/10 transition-all duration-300 
                  scale-0 group-hover:scale-100" />
                
                {/* Icon */}
                <social.icon className="w-5 h-5 text-neutral-400 
                  group-hover:text-[#F81DFB] transition-all duration-300 
                  group-hover:scale-125 relative z-10" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-neutral-400 text-center">
            &copy; {new Date().getFullYear()} WagerX.{" "}
            <span className="animate-pulse">All rights reserved.</span>
          </p>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[400px] h-px bg-gradient-to-r from-transparent via-[#E861EA] to-transparent" />
    </footer>
  );
};

export default Footer;