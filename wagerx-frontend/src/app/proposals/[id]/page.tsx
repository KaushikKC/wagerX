import { Layout } from "@/components/layout";
import { CommentSection } from "@/components/comment-section";
import Image from "next/image";
import img from "@/images/detail.png";
import { Bookmark, MessageCircle } from "lucide-react";

export default function ProposalDetailsPage() {
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
            <div className="flex justify-between z-10 relative">
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
                <div className="mt-4 flex items-center gap-4 z-10 relative">
                  <div className="flex items-center">
                    <div className="first-betyes-bar" />
                    <button className=" border-2 font-oxanium border-green-500/20 bg-[#44CE1B]/10 px-4 py-1 text-sm text-green-400 hover:bg-green-500/20">
                      Vote Yes ↑
                    </button>
                    <div className="last-betyes-bar" />
                  </div>
                  <div className="flex items-center">
                    <div className="first-betno-bar" />
                    <button className=" border-2 font-oxanium border-red-500/20 bg-red-500/10 px-4 py-1 text-sm text-red-400 hover:bg-red-500/20">
                      Vote No ↓
                    </button>
                    <div className="last-betno-bar" />
                  </div>
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
          <div className="lg:col-span-2 space-y-8">
            <div
              className="absolute   inset-[0px] top-[300px]  left-[-250px] bg-no-repeat  h-[500px]  opacity-90"
              style={{
                backgroundImage: "url('/images/Vector-1.png')"
              }}
            />
            <h3 className="text-xl font-bold text-white font-oxanium">ABOUT</h3>
            <div className="text-white ">
              <h3 className="font-bold font-oxanium mt-4">
                Why Tokenize Your Bet?
              </h3>
              <ul className="list-disc list-inside mt-2 font-oxanium">
                <li>
                  <strong>Ownership:</strong> Tokenizing your bet gives you full
                  ownership of your market position, turning it into a tradable
                  ERC20 or ERC721 token.
                </li>
                <li>
                  <strong>Liquidity:</strong> Once tokenized, your bet can be
                  bought, sold, or transferred to others, providing you with
                  enhanced liquidity.
                </li>
                <li>
                  <strong>Flexibility:</strong> Tokenized bets can be used
                  across different platforms and markets, making them a
                  versatile asset for your portfolio.
                </li>
                <li>
                  <strong>Transparency:</strong> With blockchain technology,
                  every transaction and position is recorded, offering
                  transparency and trust.
                </li>
              </ul>

              <h3 className="font-bold mt-4 font-oxanium">How It Works?</h3>
              <ul className="list-disc list-inside mt-2 font-oxanium">
                <li>
                  <strong>Place a Bet:</strong> Start by placing your bet in a
                  market on Polymarket, just as you normally would.
                </li>
                <li>
                  <strong>Tokenize Bet:</strong> Once your bet is live, click on
                  the “Tokenize Bet” button to convert it into a tokenized
                  position.
                </li>
                <li>
                  <strong>ERC20 or ERC721 Token:</strong> Choose between ERC20
                  tokens (fungible) or ERC721 tokens (non-fungible) based on
                  your desired trade and asset flexibility.
                </li>
                <li>
                  <strong>Trade or Hold:</strong> You can now trade your
                  tokenized bet in the marketplace, hold it for potential gains,
                  or transfer it to others.
                </li>
              </ul>
            </div>
            <CommentSection />
          </div>
        </div>
      </div>
    </Layout>
  );
}
