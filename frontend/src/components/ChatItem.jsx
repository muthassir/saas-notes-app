import React from "react";
import { formatTS } from "../utils/formatTS";

export default function ChatItem({ chat, isActive, onClick }) {
  const last = chat.lastMessage || {};
  const name = last.name || last.wa_id || "Unknown";
  const preview = last.text
    ? last.text.length > 60
      ? last.text.slice(0, 57) + "..."
      : last.text
    : "";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-100 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold shrink-0">
        {(name[0] || "?").toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1 items-center">
          <strong className="truncate">{name}</strong>
          <span className="text-xs text-gray-500">
            {last.timestamp ? formatTS(last.timestamp) : ""}
          </span>
        </div>
        <div className="text-sm text-gray-600 truncate">{preview}</div>
      </div>
    </div>
  );
}
