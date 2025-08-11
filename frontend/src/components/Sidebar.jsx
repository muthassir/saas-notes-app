import React, { useState } from "react";
import ChatItem from "./ChatItem";
import { FaMoon } from "react-icons/fa6";
import { LuMessageSquareText } from "react-icons/lu";
import { VscKebabVertical } from "react-icons/vsc";

const BUSINESS_NUMBER = "918329446654";

export default function Sidebar({ chats, loadingChats, selectedWa, setSelectedWa, setShowSidebar }) {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter(c => {
    const name = c.lastMessage?.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-gray-50 border-r border-gray-300 flex flex-col transition-all duration-150 w-[360px] max-w-[40%]">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
            B
          </div>
          <div>
            <div className="font-semibold">Business</div>
            <div className="text-xs text-gray-500">{BUSINESS_NUMBER}</div>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="flex justify-center items-center gap-6">
            <button>
              <FaMoon size={22} />
            </button>
            <button>
              <LuMessageSquareText size={22} />
            </button>
            <button>
              <VscKebabVertical size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 border-b">
        <input
          placeholder="Search or start new chat"
          className="w-full px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingChats && <div className="p-3 text-sm">Loading chats...</div>}
        {!loadingChats && filteredChats.length === 0 && (
          <div className="p-3 text-sm">No chats yet</div>
        )}
        {filteredChats.map((c) => (
          <ChatItem
            key={c._id}
            chat={{
              _id: c._id,
              lastMessage: c.lastMessage,
              count: c.count,
            }}
            isActive={selectedWa === c._id}
            onClick={() => {
              setSelectedWa(c._id);
              if (window.innerWidth < 640) setShowSidebar(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}
