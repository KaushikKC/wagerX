"use client";

import { Heart, MessageCircle, Bookmark } from "lucide-react";
import Image from "next/image";
import user from "@/app/images/User.png";
import { useRouter } from "next/navigation";

interface ClosedProposalCardProps {
  title: string;
  ethValue: string;
  dollarValue: string;
  likes: number;
  comments: number;
}

export function ClosedProposalCard({
  title,
  ethValue,
  dollarValue,
  likes,
  comments
}: ClosedProposalCardProps) {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/markets/${id}`);
  };
  return (
    <div
      onClick={() => handleCardClick(1)}
      className="rounded-xl bg-white/5  p-4 backdrop-blur-lg transition-all hover:bg-white/10 shadow-md shadow-[#DBDADA40] hover-shake"
    >
      <div className="flex items-start gap-3">
        <Image
          src={user}
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center text-white p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl">
              <Heart className="h-3 w-3" />
              <span className="font-oxanium ml-2 text-[12px]">
                {likes}
              </span>
            </div>
          </div>
          <h3 className="mt-1 text-lg font-oxanium font-semibold text-white">
            {title}
          </h3>
          <div className="mt-2 text-sm font-oxanium text-gray-400">
            <span>
              {ethValue} ETH Vol
            </span>
            <span className="ml-1 text-xs">
              ({dollarValue})
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center">
              <div className="first-betyes-bar" />
              <button className=" border-2 font-oxanium border-green-500/20 bg-[#44CE1B]/10 px-4 py-1 text-sm text-green-400 hover:bg-green-500/20">
                Yes - 54%
              </button>
              <div className="last-betyes-bar" />
            </div>
            <div className="flex items-center">
              <div className="first-betno-bar" />
              <button className=" border-2 font-oxanium border-red-500/20 bg-red-500/10 px-4 py-1 text-sm text-red-400 hover:bg-red-500/20">
                No - 46%
              </button>
              <div className="last-betno-bar" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-oxanium text-white text-[9px]">CRYPTO</p>
            <div className="mt-4 flex items-center gap-4 text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">
                {comments}
              </span>
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
