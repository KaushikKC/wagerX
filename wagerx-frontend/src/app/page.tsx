import { Layout } from "@/components/layout";
import { Wallet, Box, Target, BarChart3 } from "lucide-react";
import Image from "next/image";
import laptop from "@/images/laptop.png";
import Link from "next/link";

export default function LandingPage() {
  return (
    <Layout>
      <div className="relative">
        {/* Hero Section */}
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
            <div className="mt-[80px]">
              <div className="flex items-center justify-center">
                <div className="shape-container">
                  <div className="right-bar" />
                </div>
                <Link
                  href="/onboarding"
                  className="relative mx-1 bg-[#AD1AAF] text-white px-6 py-3 text-lg font-medium transition-all hover:bg-[#8c158e] hover:shadow-lg hover-shake"
                >
                  {/* Button Text */}
                  <div className="first-bar" />
                  <span className="relative z-10 font-oxaniummedium">
                    Get Set Go!
                  </span>
                  <div className="last-bar" />
                </Link>
                <div className="shape-container">
                  <div className="right-bar" />
                </div>
              </div>
            </div>
          </div>

          {/* MacBook Mockup */}
          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="relative rounded-t-xlp-2">
              <Image
                src={laptop}
                alt="Platform Preview"
                width={1200}
                height={800}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Purple Gradient Blob */}
          <div className="absolute bottom-0 left-0 right-0 h-[300px] translate-y-1/2 bg-gradient-to-b from-transparent via-[#AD1AAF] to-[#AD1AAF] blur-3xl" />
        </section>

        {/* Why Choose Section */}
        <section className="relative px-4 pt-32 md:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold font-oxaniummedium text-white md:text-4xl">
              Why to choose PREDICTS?
            </h2>
            <div className="mt-16 flex flex-col items-center justify-center z-10 rel">
              {/* Wrapper for all cards */}
              <div className="w-full max-w-6xl bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-[100px] backdrop-blur-xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
                  {/* Cards */}
                  {[
                    {
                      title: "ESG Scoring Predictions",
                      description:
                        "Bet On Companies’ ESG Scores And Drive Accountability."
                    },
                    {
                      title: "Disaster Impact Markets",
                      description:
                        "Predict Economic Impacts And Recovery Timelines."
                    },
                    {
                      title: "Tokenized Positions",
                      description:
                        "Trade Or Stake Your Predictions As NFTs And ERC20 Tokens."
                    }
                  ].map((item, index) =>
                    <div
                      key={index}
                      className="group relative rounded-2xl bg-gradient-to-b from-transparent via-transparent to-transparent p-8 transition hover:bg-white/10"
                    >
                      {/* Vertical Divider (Only for second and third cards) */}
                      {index > 0 &&
                        <div className="absolute -left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent" />}
                      <h3 className="text-center text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-center text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          className="absolute  inset-[0px] top-[1400px] left-[400px] bg-no-repeat w-[500px]  h-[700px]  "
          style={{
            backgroundImage: "url('/images/Vector-1.png')"
          }}
        />
        {/* How it Works Section */}
        <section className="px-4 py-32 md:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold font-oxaniumsemibold text-white md:text-4xl">
              How it works
            </h2>
            <div className="mt-16">
              <div className="relative flex justify-between">
                {[
                  { icon: Wallet, text: "Connect Wallet" },
                  { icon: Box, text: "Explore Markets" },
                  { icon: Target, text: "Place Your Bet" },
                  { icon: BarChart3, text: "Trade Them For Sale" }
                ].map((item, i) =>
                  <div
                    key={i}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div className="rounded-full bg-white/10 p-4">
                      <item.icon className="h-9 w-9 text-[#AD1AAF]" />
                    </div>
                    <span className="mt-4 text-md font-oxaniumregular text-white">
                      {item.text}
                    </span>
                  </div>
                )}
                {/* Connecting Line */}
                <div className="absolute top-7 left-0 right-0 border-t-2 border-dashed border-purple-500/20" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
}

const Footer = () => {
  return (
    <footer className="bg-transaprent border-t-2 border-white/20 text-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold font-oxaniumsemibold">
            Stay Connected
          </h3>
          <p className="mt-2 text-center font-oxaniummedium">
            Join our community and stay updated with the latest news and offers.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.35C0 23.4.6 24 1.325 24h21.35C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0zm-3.15 12.1h-3.1v10.9h-4.1V12.1h-2.7v-4.1h2.7V6.1c0-3.1 1.8-4.8 4.5-4.8 1.3 0 2.5.1 2.8.1v3.2h-1.9c-1.5 0-1.8.7-1.8 1.7v2.2h3.6l-.5 4.1z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57c-.885.392-1.83.656-2.825.775 1.013-.607 1.794-1.564 2.165-2.724-.951.56-2.005.973-3.127 1.195-.896-.956-2.173-1.55-3.594-1.55-2.719 0-4.926 2.207-4.926 4.926 0 .386.045.761.127 1.124-4.092-.205-7.72-2.165-10.148-5.144-.426.731-.669 1.577-.669 2.477 0 1.71.87 3.213 2.188 4.094-.807-.026-1.566-.247-2.228-.616v.062c0 2.384 1.693 4.373 3.946 4.826-.414.112-.848.171-1.293.171-.316 0-.624-.031-.927-.086.624 1.953 2.433 3.375 4.577 3.415-1.676 1.314-3.785 2.095-6.07 2.095-.394 0-.785-.023-1.17-.067 2.174 1.394 4.768 2.206 7.548 2.206 9.055 0 14.003-7.496 14.003-13.986 0-.213-.005-.426-.014-.637.961-.693 1.8-1.56 2.46-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.539v-5.569c0-1.327-.027-3.034-1.847-3.034-1.848 0-2.131 1.44-2.131 2.93v5.673h-3.539V9h3.396v1.563h.049c.473-.895 1.632-1.838 3.354-1.838 3.588 0 4.247 2.36 4.247 5.43v5.295zM5.337 7.5c-1.136 0-2.063.927-2.063 2.063 0 1.136.927 2.063 2.063 2.063 1.136 0 2.063-.927 2.063-2.063 0-1.136-.927-2.063-2.063-2.063zm1.769 12.952H3.568V9h3.538v11.452zM22.225 0H1.775C.794 0 0 .794 0 1.775v20.45C0 23.206.794 24 1.775 24h20.45C23.206 24 24 23.206 24 22.225V1.775C24 .794 23.206 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-600 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PredictS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
