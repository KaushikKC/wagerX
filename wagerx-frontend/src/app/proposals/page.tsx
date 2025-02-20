"use client";

import { ClosedProposalCard } from "@/components/closed-proposal-card";
import Footer from "@/components/footer";
import { Layout } from "@/components/layout";
import MarketProposalModal from "@/components/marketProposalModel";
import { ProposalCard } from "@/components/proposal-card";
import React, { useState } from "react";

function Proposals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Layout>
      <section className="relative overflow-hidden px-4 pb-10 pt-16 md:px-6 md:pt-24">
        <div className="flex justify-center mb-10">
          <h1 className="font-oxanium text-white text-[30px]">Voting Panel</h1>
        </div>
        <div className="mx-[200px] flex items-center justify-end my-10  mt-2 z-10 relative">
          <div className="first-purple-bar" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-[#AD1AAF] font-oxanium border-2 py-2 px-10 bg-transparent backdrop-blur-xl text-white hover:text-white hover:bg-[#AD1AAF]"
          >
            Create New Market Proposal
          </button>
          <div className="last-purple-bar" />
        </div>
        {/* Render Modal */}
        {isModalOpen &&
          <MarketProposalModal onClose={() => setIsModalOpen(false)} />}
        <div className="mx-[50px]">
          <p className="font-oxanium text-white text-[30px]">
            Active Proposals
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ProposalCard
              title="Will Bitcoin Hit $100k In November?"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
            <ProposalCard
              title="Will Bitcoin Hit $100k In November?"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
            <ProposalCard
              title="Will Bitcoin Hit $100k In November?"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
          </div>
          <p className="font-oxanium mt-10 text-white text-[30px]">
            Closed Proposals
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ClosedProposalCard
              title="Will Bitcoin Hit $100k In November?"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
            <ClosedProposalCard
              title="Will Bitcoin Hit $100k In November?"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
            <ClosedProposalCard
              title="Will Bitcoin Hit $100k In November?"
              ethValue="4.89"
              dollarValue="$654,874.86"
              likes={341}
              comments={412}
            />
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
}

export default Proposals;
