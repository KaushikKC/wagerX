import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import wave from "@/images/wave.png";
import Link from "next/link";

function OnboardingPage() {
  return (
    <Layout>
      <section className="relative overflow-hidden px-4 pt-16 md:px-6 md:pt-24">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="bg-gradient-to-r font-oxaniumsemibold from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl md:text-7xl">
            The Future Is Predictable – Bet On It
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white font-oxaniummedium">
            Decentralized Prediction Markets For{" "}
            <span className="text-[#F81DFB]">ESG Trends</span>,{" "}
            <span className="text-[#F81DFB]">Disasters </span>
            <span className="text-[#F81DFB]">And Global Events</span>.
          </p>
        </div>
        <div className="mx-[400px] mt-10">
          <p className="font-oxaniumsemibold text-[20px] mb-5 text-white">
            Name
          </p>
          <Input
            placeholder="Enter Name"
            className="h-12 bg-transparent pl-12 backdrop-blur-xl border-[#A7A7A7] w-[620px] mx-auto  text-white"
          />
          <p className="font-oxaniumsemibold text-[20px] my-5 text-white">
            Email
          </p>
          <Input
            placeholder="Enter Email"
            className="h-12 bg-transparent pl-12 backdrop-blur-xl border-[#A7A7A7] w-[620px] mx-auto text-white"
          />
        </div>
        <div
          className="absolute  inset-[0px] top-[150px]  left-[-250px] bg-no-repeat  h-[500px]  opacity-90"
          style={{
            backgroundImage: "url('/images/Vector-1.png')",
          }}
        />
        <div className="mt-[80px]">
          <div className="flex items-center justify-center">
            <div className="shape-container">
              <div className="right-bar"></div>
            </div>
            <Link
              href="/dashboard"
              className="relative mx-1 bg-[#AD1AAF] text-white px-6 py-3 text-lg font-medium transition-all hover:bg-[#8c158e] hover:shadow-lg hover-shake"
            >
              {/* Button Text */}
              <div className="first-bar"></div>
              <span className="relative z-10 font-oxaniummedium">
                Start Your Prediction Now
              </span>
              <div className="last-bar"></div>
            </Link>
            <div className="shape-container">
              <div className="right-bar"></div>
            </div>
          </div>
        </div>
        <Image src={wave} className="w-full" alt="" />
      </section>
    </Layout>
  );
}

export default OnboardingPage;
