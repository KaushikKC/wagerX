

"use client";

import { FeatureSection } from "@/components/FeatureSection";
import Footer from "@/components/footer";
import { Layout } from "@/components/layout";
import { Wallet, Box, Target, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import bgPattern from "@/app/images/pattern.svg";

const useScrollAnimation = () => {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.scroll-animate').forEach((element) => {
      element.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
};

export default function LandingPage() {
  useScrollAnimation();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Layout>
      <div className="relative min-h-screen">
        <section className="relative overflow-hidden px-4 pt-16 md:px-6 md:pt-24 2xl:pt-32">
  <div className="absolute inset-0 w-full h-full">
    <Image
      src={bgPattern}
      alt="Background Pattern"
      fill
      className={`object-repeat transition-all duration-1000 ease-out
        ${isLoaded ? 'opacity-20 scale-100' : 'opacity-0 scale-110'}`}
      style={{
        filter: 'blur(0.5px)',
        objectFit: 'repeat',
        transform: `perspective(1000px) ${isLoaded ? 'rotateX(0deg)' : 'rotateX(-5deg)'}`,
      }}
      priority
    />
    <div 
      className={`absolute inset-0 bg-gradient-to-b from-black/10 to-transparent
        transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
    />
  </div>

  <div className="relative mx-auto max-w-7xl text-center z-10">
    <h1 
      className={`bg-gradient-to-r font-oxanium from-white to-white/80 bg-clip-text 
        text-3xl font-bold text-transparent sm:text-5xl md:text-6xl 2xl:text-7xl
        transition-all duration-1000 ease-out 
        ${isLoaded 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'}`}
    >
      Predict, Compete, Win – A Social Betting Playground for Friends!
    </h1>
    
    <p 
      className={`mx-auto mt-6 max-w-3xl text-base sm:text-lg text-white 
        font-oxanium lg:text-xl transition-all duration-1000 ease-out animate-float
        ${isLoaded 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'}`}
      style={{ transitionDelay: '200ms' }}
    >
      Turn friendly wagers into fun, token-powered competitions. Bet on{" "}
      <span className="inline-block text-[#F81DFB] transition-transform duration-300">
        real-life goals
      </span>,{" "}
      <span className="inline-block text-[#F81DFB] transition-transform duration-300" 
        style={{ animationDelay: '0.2s' }}>
        track progress
      </span>, and{" "}
      <span className="inline-block text-[#F81DFB] transition-transform duration-300"
        style={{ animationDelay: '0.4s' }}>
        climb the leaderboard
      </span>!
    </p>
  </div>

  <div 
    className={`my-[60px] md:my-[80px] transition-all duration-1000 ease-out
      ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    style={{ transitionDelay: '400ms' }}
  >
    <div className="flex items-center justify-center">
      <div className="shape-container animate-slide-right ">
        <div className="right-bar" />
      </div>
      <Link
        href="/onboarding"
        className="group relative mx-1 bg-[#AD1AAF] text-white px-4 sm:px-6 py-3 
          text-base sm:text-lg font-medium overflow-hidden 
          transition-all duration-500 hover:shadow-[0_0_30px_rgba(173,26,175,0.5)]
          hover:scale-105 transform-gpu "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#AD1AAF] to-[#8c158e] opacity-0 
          group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500
          bg-[radial-gradient(circle_at_50%_50%,rgba(248,29,251,0.5),transparent_60%)]" />
        <div className="first-bar" />
        <span className="relative z-10 font-oxanium transition-transform duration-500
          group-hover:scale-105">
          Start Betting Now!
        </span>
        <div className="last-bar" />
      </Link>
      <div className="shape-container animate-slide-left">
        <div className="right-bar" />
      </div>
    </div>
  </div>

  {/* Enhanced gradient overlay */}
  <div 
    className={`absolute bottom-0 left-0 right-0 h-[300px] translate-y-1/2 
      bg-gradient-to-b from-transparent via-[#AD1AAF]/30 to-[#AD1AAF]/30 blur-3xl
      transition-all duration-1000 ease-out
      ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    style={{ transitionDelay: '600ms' }}
  />
</section>

        {/* Why Choose Section */}
        <section className="relative overflow-hidden pb-9 px-4 pt-12 md:px-6 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="scroll-animate text-center text-2xl sm:text-3xl font-bold font-oxanium text-white md:text-4xl">
              Why choose WAGERX?
            </h2>
            <div className="mt-16 flex flex-col items-center justify-center z-10">
<FeatureSection />

           
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[300px] translate-y-1/2 
        bg-gradient-to-b from-transparent via-[#AD1AAF]/30 to-[#AD1AAF]/30 blur-3xl" />
          </div>
        </section>

        {/* Background Vector */}
        <div
          className="absolute hidden lg:block inset-0 top-[1400px] left-[400px] bg-no-repeat w-[500px] h-[700px]"
          style={{
            backgroundImage: "url('app/images/Vector-1.png')"
          }}
        />

        {/* How it Works Section */}
        <section className="px-4 py-12 md:px-6 lg:py-20 relative overflow-hidden">
  <div className="mx-auto max-w-7xl">
    <h2 className="scroll-animate text-center text-2xl sm:text-3xl font-bold font-oxanium text-white md:text-4xl">
      How it works ?
    </h2>
    <p 
      className={`mx-auto mt-6 max-w-3xl text-base sm:text-lg text-white 
        font-oxanium lg:text-xl transition-all duration-1000 ease-out text-center
        ${isLoaded 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'}`}
      style={{ transitionDelay: '200ms' }}
    >
Bet on life’s fun moments with friends! Our social prediction market lets you create or join bets on      
<span className="inline-block text-[#F81DFB] font-semibold transition-transform duration-300">
sports outcomes      
</span>,{" "}
      <span className="inline-block text-[#F81DFB] font-semibold transition-transform duration-300" 
        style={{ animationDelay: '0.2s' }}>
anything—fitness goals      </span>, or {" "}
      <span className="inline-block text-[#F81DFB] font-semibold transition-transform duration-300"
        style={{ animationDelay: '0.4s' }}>
       even who will finish their project first. 
      </span> Compete, track progress, and win rewards—all powered by Web3. No complex odds, just friendly wagers with real stakes!  
    </p>
    <div className="mt-16">
      <div className="relative  flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
        {[
          { 
            icon: Wallet, 
            text: "Connect Wallet",
            description: "Link your digital wallet securely" 
          },
          { 
            icon: Box, 
            text: "Explore Markets",
            description: "Browse through available betting options" 
          },
          { 
            icon: Target, 
            text: "Place Your Bet",
            description: "Make your prediction with confidence" 
          },
          { 
            icon: BarChart3, 
            text: "Trade Them For Sale",
            description: "Manage and trade your positions" 
          }
        ].map((item, i) => (
          <div
            key={i}
            className="group scroll-animate relative z-10 flex flex-col items-center
              transition-all duration-500 hover:scale-110"
            style={{ 
              animationDelay: `${i * 200}ms`,
              transform: 'perspective(1000px)',
            }}
          >
            {/* Icon Container with 3D effect */}
            <div className="rounded-full bg-white/10 p-4 transition-all duration-500 
              group-hover:bg-white/20 group-hover:shadow-[0_0_30px_rgba(173,26,175,0.5)]
              transform group-hover:-translate-y-2">
              <item.icon className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] text-[#AD1AAF]
                transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg]" />
            </div>

            {/* Text with fade-up effect */}
            <div className="relative mt-4 text-center transition-all duration-500 
              group-hover:-translate-y-2">
              <span className="block text-md sm:text-lg font-oxanium text-white 
                transition-all duration-500 group-hover:text-[#F81DFB]">
                {item.text}
              </span>
              
              {/* Description tooltip */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 
                text-sm text-neutral-400 opacity-0 transition-all duration-500
                group-hover:opacity-100">
                {item.description}
              </span>
            </div>

            {/* Particle effects */}
            <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 
              transition-opacity duration-500 pointer-events-none">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-1 bg-[#AD1AAF] rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `particle-float ${2 + Math.random()}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
     
        {/* Animated connecting line */}
        <div className="absolute top-10 left-0 right-0 hidden sm:block overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#AD1AAF]/50 to-transparent
            animate-pulse-gradient" />
        </div>
      </div>
    </div>
  </div>
  <div className="absolute bottom-0 left-0 right-0 h-[300px] translate-y-1/2 
        bg-gradient-to-b from-transparent via-[#AD1AAF]/30 to-[#AD1AAF]/30 blur-3xl" />

</section>

      </div>
      <Footer />
    </Layout>
  );
}

