import { Layout } from "@/components/layout";
import { MarketChart } from "@/components/market-chart";
import { BetCard } from "@/components/bet-card";
import { TokenizationSteps } from "@/components/tokenization-steps";
import { CommentSection } from "@/components/comment-section";
import Image from "next/image";
import img from "@/app/images/detail.png";
import { Bookmark, MessageCircle } from "lucide-react";
import Footer from "@/components/footer";

export default function MarketDetailsPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8 p-4">
        <div className="rounded-3xl w-[900px] mx-auto bg-white/10 border-white/40 border p-6 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <Image
              src={img}
              alt="Market"
              width={180}
              height={180}
              className="rounded-xl"
            />
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-400">• Active</span>
                </div>
                <h1 className="mt-2 text-2xl font-bold text-white">
                  Will Bitcoin Hit $100k In November?
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                  <span>CRYPTO</span>
                </div>
              </div>
              <div className="ml-10 space-y-3">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-3 text-white w-[140px] ">
                  <span className="text-sm font-oxanium ">Market Ends On </span>
                  <span className="text-sm font-oxanium text-white">
                    25 Dec, 2024
                  </span>
                </div>
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-3  text-white w-[140px]">
                  <span className="text-sm font-oxanium">
                    Total Volume: $543,578.13
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-gray-400 justify-end">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">412</span>
            <Bookmark className="h-4 w-4" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 ">
            <div
              className="absolute  inset-[0px] top-[200px]  left-[-250px] bg-no-repeat  h-[500px]  opacity-90"
              style={{
                backgroundImage: "url('/images/Vector-1.png')"
              }}
            />
            <div
              className="absolute  inset-[0px] top-[1000px]  left-[-250px] bg-no-repeat  h-[500px]  opacity-90"
              style={{
                backgroundImage: "url('/images/Vector-1.png')"
              }}
            />
            <MarketChart />
            <TokenizationSteps />
            <CommentSection />
          </div>
          <div className="space-y-8">
            <BetCard />
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
