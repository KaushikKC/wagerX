import Footer from "@/components/footer";
import { Layout } from "@/components/layout";
import { MarketCard } from "@/components/market-card";
// import NFTCard from "@/components/NFTCard";
import React from "react";

function Portfolio() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-4">
        <div className=" flex justify-center my-10">
          <h1 className="font-oxanium text-white text-[30px] font-bold">
            My Bets
          </h1>
        </div>
        <div
          className="absolute  inset-[0px] top-[280px]  left-[-250px] bg-no-repeat  h-[500px]  opacity-90"
          style={{
            backgroundImage: "url('/images/Vector-1.png')"
          }}
        />
        <div className="mx-[50px] my-16">
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
        </div>
        {/* <div className="mx-[50px] mt-20">
          <p className="font-oxanium text-white text-[30px]">My NFTs</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <NFTCard />
            <NFTCard />
            <NFTCard />
          </div>
        </div> */}
      </div>
      <Footer />
    </Layout>
  );
}

export default Portfolio;
