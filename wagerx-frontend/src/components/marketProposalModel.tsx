import React from "react";

interface MarketProposalModalProps {
  onClose: () => void;
}

function MarketProposalModal({ onClose }: MarketProposalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#140C1F] bg-opacity-60">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-8 w-[90%] max-w-[800px] text-white">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-oxanium">Create New Market Proposal</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Input Fields */}
        <p className="text-white font-oxanium text-[18px] mb-5">General</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Market Type
            </label>
            <input
              type="text"
              placeholder="Enter Market Type"
              className="w-full px-4 py-2 font-oxanium rounded bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Market Title
            </label>
            <input
              type="text"
              placeholder="Enter Market Title"
              className="w-full px-4 py-2 rounded font-oxanium bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Resolution Date
            </label>
            <input
              type="date"
              placeholder="Enter the Date"
              className="w-full px-4 py-2 rounded font-oxanium bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Oracle Source:
            </label>
            <input
              type="text"
              placeholder="Enter Oracle Source"
              className="w-full px-4 py-2 rounded font-oxanium bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Description
            </label>
            <textarea
              placeholder="Provide a detailed description about the market"
              rows={3}
              className="w-full px-4 py-2 rounded font-oxanium bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <p className="text-white font-oxanium text-[18px] my-5">
          Stake Requirements
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Minimum Stake:
            </label>
            <input
              type="number"
              placeholder="Enter Minimum Stake:"
              className="w-full px-4 py-2 rounded font-oxanium bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-oxanium">
              Accepted Tokens:
            </label>
            <input
              type="text"
              placeholder="Enter Accepted Tokens:"
              className="w-full px-4 py-2 rounded font-oxanium bg-white/20 border border-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10 ">
          {/* <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-[#AD1AAF] text-white hover:bg-purple-700 transition-all"
          >
            Submit Proposal
          </button> */}
          <div className=" flex items-center justify-end  z-10 relative">
            <div className="first-purple-bar" />
            <button
              onClick={onClose}
              className="border-[#AD1AAF] font-oxanium border-2 py-2 px-10 hover:bg-transparent backdrop-blur-xl text-white hover:text-white bg-[#AD1AAF]"
            >
              Submit Proposal
            </button>
            <div className="last-purple-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketProposalModal;
