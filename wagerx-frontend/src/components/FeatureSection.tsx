"use client";

import { FC } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description }) =>
  <div className="cursor-pointer group overflow-hidden p-5 duration-1000 hover:duration-1000 relative w-64 h-64 border border-[#E861EA] rounded-xl">
    {/* Animated Background Elements */}
    <div className="group-hover:-rotate-45 bg-transparent group-hover:scale-150 -top-12 -left-12 absolute shadow-red-400 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24" />
    <div className="group-hover:rotate-45 bg-transparent group-hover:scale-150 top-44 left-14 absolute shadow-purple-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24" />
    <div className="group-hover:-rotate-45 bg-transparent group-hover:scale-150 top-24 left-56 absolute shadow-[#AD1AAF] shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24" />
    <div className="group-hover:-rotate-45 bg-transparent group-hover:scale-150 top-12 left-12 absolute shadow-[#E861EA] shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-12 h-12" />
    <div className="group-hover:rotate-45 bg-transparent group-hover:scale-150 top-12 left-12 absolute shadow-[#653F66] shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-44 h-44" />
    <div className="group-hover:rotate-45 bg-transparent group-hover:scale-150 -top-24 -left-12 absolute shadow-[#A792A7] shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-64 h-64" />
    <div className="group-hover:-rotate-45 bg-transparent group-hover:scale-150 top-24 left-12 absolute shadow-[#AD1AAF] shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-4 h-4" />

    {/* Content */}
    <div className="w-full h-full shadow-xl shadow-neutral-900 p-3 bg-neutral-600/50 backdrop-blur-sm rounded-xl flex-col gap-2 flex justify-center transform transition-all duration-500 group-hover:bg-neutral-600/70">
      <span className="text-neutral-50 font-bold text-xl italic">
        {title}
      </span>
      <p className="text-neutral-300">
        {description}
      </p>
    </div>
  </div>;

export function FeatureSection() {
  const features = [
    {
      title: "Smart Predictions",
      description:
        "Leverage AI-powered insights and community wisdom to make informed betting decisions."
    },
    {
      title: "Social Trading",
      description:
        "Connect with fellow traders, share strategies, and build your betting portfolio together."
    },
    {
      title: "Secure Platform",
      description:
        "Experience worry-free betting with our advanced blockchain security protocols."
    },
    {
      title: "NFT Integration",
      description:
        "Transform your predictions into tradeable NFTs and build your digital portfolio."
    },
    {
      title: "Community Rewards",
      description:
        "Earn rewards for accurate predictions and contributing to the ecosystem."
    }
  ];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-16">
          {/* Top Row - 3 Cards */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {features.slice(0, 3).map((feature, index) =>
              <div
                key={index}
                className="scroll-animate transform transition-all duration-500 md:translate-y-0"
                style={{
                  animationDelay: `${index * 200}ms`,
                  transform: `translateY(${index === 1 ? "2rem" : "0"})`
                }}
              >
                <FeatureCard {...feature} />
              </div>
            )}
          </div>

          {/* Bottom Row - 2 Cards */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:-mt-8">
            {features.slice(3, 5).map((feature, index) =>
              <div
                key={index + 3}
                className="scroll-animate transform transition-all duration-500"
                style={{
                  animationDelay: `${(index + 3) * 200}ms`,
                  transform: `translateY(${index === 0 ? "-2rem" : "0"})`
                }}
              >
                <FeatureCard {...feature} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
