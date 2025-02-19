import { Layout } from "@/components/layout";
import { MarketCard } from "@/components/market-card";
import { StatsCard } from "@/components/stats-card";
import Chatbot from "@/components/ui/ChatBot";
import { UserCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 overflow-hidden">
        <section>
          <h2 className="flex items-center gap-2 font-oxaniumsemibold text-xl font-bold text-white">
            RECENT TRENDING MARKETS
            <span className="text-orange-500">🔥</span>
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <MarketCard
              title="Will Bitcoin Hit $100k In November?"
              status="Active"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
            <MarketCard
              title="Will Bitcoin Hit $100k In November?"
              status="Resolving"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
            <MarketCard
              title="Will Bitcoin Hit $100k In November?"
              status="Closed"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-oxaniumsemibold text-xl font-bold text-white">
            USER STATISTICS
            <UserCircle className="h-8 w-8 text-gray-400" />
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Current Holdings"
              value="$ 14,211,030"
              subValue="(~ 41,000 ETH)"
            />
            <StatsCard title="Markets Participated" value="130" />
            <StatsCard title="Leaderboard Position" value="#21" />
            <StatsCard title="Tokenized Positions" value="15" />
          </div>
        </section>
        <div
          className="absolute  inset-[420px] bg-center left-[-200px] bg-cover h-[600px] opacity-70"
          style={{
            backgroundImage: "url('/images/Vector-1.png')",
          }}
        />
        <div
          className="absolute  inset-[420px] bg-center right-[100px] bg-cover h-[600px] opacity-70"
          style={{
            backgroundImage: "url('/images/Vector-1.png')",
          }}
        />

        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-oxaniumsemibold font-bold text-white">
            ABOUT US
            <span className="text-orange-500">📜</span>
          </h2>
          <div className="text-white ">
            <h3 className="font-bold font-oxaniumsemibold mt-4">
              Why Tokenize Your Bet?
            </h3>
            <ul className="list-disc list-inside mt-2 font-oxaniummedium">
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
                <strong>Flexibility:</strong> Tokenized bets can be used across
                different platforms and markets, making them a versatile asset
                for your portfolio.
              </li>
              <li>
                <strong>Transparency:</strong> With blockchain technology, every
                transaction and position is recorded, offering transparency and
                trust.
              </li>
            </ul>

            <h3 className="font-bold mt-4 font-oxaniumsemibold">
              How It Works?
            </h3>
            <ul className="list-disc list-inside mt-2 font-oxaniummedium">
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
                tokens (fungible) or ERC721 tokens (non-fungible) based on your
                desired trade and asset flexibility.
              </li>
              <li>
                <strong>Trade or Hold:</strong> You can now trade your tokenized
                bet in the marketplace, hold it for potential gains, or transfer
                it to others.
              </li>
            </ul>
          </div>
          <Chatbot />
        </section>
      </div>
    </Layout>
  );
}
