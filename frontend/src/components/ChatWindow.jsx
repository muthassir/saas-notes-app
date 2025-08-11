import React, { useRef, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { VscKebabVertical } from "react-icons/vsc";
import { ImAttachment } from "react-icons/im";
import { IoSendSharp } from "react-icons/io5";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  chats,
  messages,
  selectedWa,
  loadingMessages,
  composer,
  setComposer,
  handleSend,
  setShowSidebar,
}) {
  const msgAreaRef = useRef();

  const messagesForSelected = selectedWa
    ? messages.filter((m) => m.wa_id === selectedWa)
    : [];

  useEffect(() => {
    if (msgAreaRef.current) {
      msgAreaRef.current.scrollTo({
        top: msgAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messagesForSelected.length, selectedWa]);

  const selectedChat = chats.find((c) => c._id === selectedWa);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-3 flex items-center gap-3 bg-white border-b border-gray-300">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setShowSidebar(true)}
            className="sm:hidden px-2 py-1 rounded hover:bg-gray-100"
          >
            ←
          </button>

          <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
            {(selectedChat?.lastMessage?.name || "C")[0] || "?"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">
              {selectedChat?.lastMessage?.name || selectedWa || "Select a chat"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {selectedChat?.lastMessage?.wa_id || ""}
            </div>
          </div>

          <div className="hidden sm:flex gap-2 items-center">
            <button className="px-3 py-1 rounded hover:bg-gray-100">
              <IoIosSearch size={20} />
            </button>
            <button className="px-3 py-1 rounded hover:bg-gray-100">
              <VscKebabVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]"
        ref={msgAreaRef}
      >
        {loadingMessages && (
          <div className="p-6 text-sm text-gray-600">Loading messages...</div>
        )}

        {!loadingMessages && !selectedWa && (
          <div className="p-6 text-sm text-gray-600">
            Select a chat to view messages
          </div>
        )}

        {!loadingMessages && selectedWa && messagesForSelected.length === 0 && (
          <div className="p-6 text-sm text-gray-600">No messages in this chat yet</div>
        )}

        {messagesForSelected.map((m) => (
          <MessageBubble
            key={m._id || m.message_id || Math.random()}
            m={m}
          />
        ))}
      </div>

      <div className="p-3 bg-gray-100 flex gap-2 items-center border-t border-gray-300">
        <button>
          <ImAttachment size={20} className="text-gray-600" />
        </button>
        <input
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-4 cursor-pointer rounded-full bg-green-500 text-white text-sm"
        >
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
}
