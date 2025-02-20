import { Wallet, Box, Coins, BarChart3 } from "lucide-react";

export function TokenizationSteps() {
  return (
    <div className="space-y-6 mt-10">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white font-oxanium">
          TOKENIZATION
        </h3>

        <div className="flex items-center">
          <div className="shape-container">
            <div className="right-bar" />
          </div>
          <button className="relative mx-1  bg-[#AD1AAF] text-white px-5 py-2 text-lg font-medium transition-all  hover:shadow-lg h-[55px]">
            {/* Button Text */}
            <div className="first-bar" />
            <span className="relative z-10  font-oxanium flex items-center space-x-2">
              Tokenize Bet
              <Box className="h-4 w-4 ml-2" />
            </span>
            <div className="last-bar" />
          </button>
          <div className="shape-container">
            <div className="right-bar" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium font-oxanium text-white">
            Why Tokenize Your Bet?
          </h4>
          <ul className="space-y-2 text-sm text-gray-400 font-oxanium">
            <li>
              • Ownership: Tokenizing your bet gives you full ownership of your
              market position, turning it into a tradable ERC20 or ERC721 token.
            </li>
            <li>
              • Liquidity: Once tokenized, your bet can be bought, sold, or
              transferred to others, providing you with enhanced liquidity.
            </li>
            <li>
              • Flexibility: Tokenized bets can be used across different
              platforms and markets, making them a versatile asset for your
              portfolio.
            </li>
            <li>
              • Transparency: With blockchain technology, every transaction and
              position is recorded, offering transparency and trust.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-white">How It Works?</h4>
          <div className="flex justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-purple-600/20 p-3">
                <Wallet className="h-8 w-8 text-[#F81DFB]" />
              </div>
              <span className="text-sm text-white">Place a Bet</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-purple-600/20 p-3">
                <Box className="h-8 w-8 text-[#F81DFB]" />
              </div>
              <span className="text-sm text-white">Tokenize Bet</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-purple-600/20 p-3">
                <Coins className="h-8 w-8 text-[#F81DFB]" />
              </div>
              <span className="text-sm text-white">ERC20/721 Token</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-purple-600/20 p-3">
                <BarChart3 className="h-8 w-8 text-[#F81DFB]" />
              </div>
              <span className="text-sm text-white">Trade or Hold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
