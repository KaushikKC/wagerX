"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BetCard() {
  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 bg-transparent backdrop-blur-xl border-white/40 border">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-oxanium font-bold text-[#F81DFB]">
          Buy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400 w-[300px]">
            PICK YOUR CHOICE
          </h4>
          <div className="space-y-2 w-[300px]">
            <div className="flex items-center">
              <div className="first-betyes-bar" />
              <button className="w-[300px] flex justify-between border-2 font-oxanium border-green-500/20 bg-[#44CE1B]/10 px-4 py-1 text-sm text-green-400 hover:bg-green-500/20">
                Bet On Yes ↑ <span className="float-right">41.05 %</span>
              </button>
              <div className="last-betyes-bar" />
            </div>
            <div className="flex items-center">
              <div className="first-betno-bar" />
              <button className="w-[300px] flex justify-between border-2 font-oxanium border-red-500/20 bg-red-500/10 px-4 py-1 text-sm text-red-400 hover:bg-red-500/20">
                Bet On No ↓ <span className="float-right">41.05 %</span>
              </button>
              <div className="last-betno-bar" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400 w-[300px]">
            HOW MUCH?
          </h4>
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              className="bg-transparent w-[300px] border-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              ETH | <span className="text-[#F81DFB]">Max</span>
            </span>
          </div>
        </div>
        <div className="flex items-center mx-auto">
          <div className="first-purple-bar" />
          <Button
            variant="outline"
            className="border-[#AD1AAF] font-oxanium border-2 px-10 bg-transparent backdrop-blur-xl text-white hover:text-white  hover:bg-[#AD1AAF]"
          >
            Trade On Your bet
          </Button>
          <div className="last-purple-bar" />
        </div>
      </CardContent>
    </Card>
  );
}
