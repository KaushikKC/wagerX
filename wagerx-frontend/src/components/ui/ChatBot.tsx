"use client";
import { useState } from "react";
import Image from "next/image";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { FaMagic } from "react-icons/fa";

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [variableType, setVariableType] = useState(0);

  const API_URL = "https://cdp-agent-kit-ds6792.replit.app/chat";

  // Function to send API calls
  const sendApiCall = async (query: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: variableType,
          query
        })
      });

      const data = await response.json();
      if (data && data.message) {
        const botReply = {
          id: Date.now(),
          type: "bot",
          text: data.message
        };
        setMessages(prev => [...prev, botReply]); // Display API response in the UI
      }
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      setVariableType(0); // Reset the variable after showing the response
    }
  };

  // Handle sending user input
  const handleInputSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { id: Date.now(), type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    await sendApiCall(input); // Trigger API call with user input
    setInput(""); // Clear input field
  };

  // Handle predefined options
  const handleOptionClick = (option: string) => {
    let botMessage = "";
    let userMessage = "";

    if (option === "Create Market") {
      userMessage = "I want to create a market";
      botMessage = `Kindly enter your market detail starting with:
Market Type, Market Title, Resolution Date,
Minimum stake, Accepted Token, Oracle Source, and Description.`;
      setVariableType(1); // Set type to 1
    } else if (option === "To Bet") {
      userMessage = "I want to bet";
      botMessage = `Kindly enter your Market title and respond with Yes or No.`;
      setVariableType(3); // Set type to 3
    } else if (option === "To Vote") {
      userMessage = "I need to vote";
      botMessage = `Kindly enter your Market title and respond with Yes or No.`;
      setVariableType(2); // Set type to 2
    }

    const newMessages = [
      { id: Date.now(), type: "user", text: userMessage },
      { id: Date.now() + 1, type: "bot", text: botMessage }
    ];
    setMessages(prev => [...prev, ...newMessages]);
    setMenuOpen(false);
  };

  return (
    <div className="font-oxanium">
      {/* Minimalistic Chat Icon */}
      <div
        className="fixed bottom-4 right-4 bg-[#AD1AAF] rounded-full p-4 cursor-pointer shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TbMessageChatbotFilled size={24} />
      </div>

      {/* Chat Window */}
      {isOpen &&
        <div className="fixed bottom-16 right-4 w-80 bg-gray-900 rounded-xl shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#AD1AAF] text-white py-3 px-4 rounded-t-xl font-semibold">
            Chatbot
          </div>

          {/* Chat Messages */}
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto"
            }}
            className="p-4 space-y-4"
          >
            {messages.map(msg =>
              <div
                key={msg.id}
                className={`flex ${msg.type === "user"
                  ? "flex-row-reverse"
                  : ""} gap-4`}
              >
                <Image
                  src={
                    msg.type === "user"
                      ? "/images/avatar.png"
                      : "/images/chat.png"
                  }
                  alt={msg.type === "user" ? "User" : "Bot"}
                  width={30}
                  height={30}
                  className="rounded-full"
                />

                <div
                  className={`max-w-[70%] p-3 border ${msg.type === "user"
                    ? "bg-[#AD1AAF]/10 border-[#AD1AAF] rounded-l-xl rounded-br-2xl"
                    : "bg-white/10 border-purple-700 rounded-r-xl rounded-bl-2xl"}`}
                >
                  <p className="text-sm text-white whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="relative flex items-center border-t border-gray-700 p-3 bg-gray-800">
            {/* Magic Wand Icon */}
            <div className="relative">
              <FaMagic
                size={20}
                className="text-[#AD1AAF] cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen &&
                <div className="absolute bottom-10 left-0 bg-gray-700 text-white rounded-lg shadow-lg py-2 w-40">
                  <div
                    className="hover:bg-gray-600 px-4 py-2 cursor-pointer"
                    onClick={() => handleOptionClick("Create Market")}
                  >
                    Create Market
                  </div>
                  <div
                    className="hover:bg-gray-600 px-4 py-2 cursor-pointer"
                    onClick={() => handleOptionClick("To Bet")}
                  >
                    To Bet
                  </div>
                  <div
                    className="hover:bg-gray-600 px-4 py-2 cursor-pointer"
                    onClick={() => handleOptionClick("To Vote")}
                  >
                    To Vote
                  </div>
                </div>}
            </div>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 ml-3"
            />
            <button
              onClick={handleInputSend}
              className="ml-3 bg-[#AD1AAF] hover:bg-[#8c158e] text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>}
    </div>
  );
};

export default Chatbot;
