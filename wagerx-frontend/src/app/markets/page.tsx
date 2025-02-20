"use client";

import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MarketCard } from "@/components/market-card";

const categories = [
  "Top Markets",
  "New",
  "Crypto",
  "Create",
  "Create",
  "Create",
  "Create",
];

export default function MarketsPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <div className="relative ">
          <Input
            placeholder="Search Markets"
            className="h-12 bg-transparent pl-12 backdrop-blur-xl border-[#AD1AAF] w-[1000px] mx-auto text-center text-white"
          />

          <Search className="absolute top-6 right-36 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex w-full justify-between gap-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            // eslint-disable-next-line react/jsx-key
            <div className="flex items-center">
              <div className="first-purple-bar" />
              <Button
                key={category}
                variant="outline"
                className="border-[#AD1AAF] font-oxanium border-2 px-10 bg-transparent backdrop-blur-xl text-white hover:text-white  hover:bg-[#AD1AAF]"
              >
                {category}
              </Button>
              <div className="last-purple-bar" />
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="absolute inset-[220px] bg-cover bg-center h-screen"
            style={{
              backgroundImage: "url('/images/Vector-1.png')",
            }}
          />
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
      </div>
    </Layout>
  );
}
