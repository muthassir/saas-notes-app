import React from "react";
import StatusTicks from "./StatusTicks";
import { formatTS } from "../utils/formatTS";

const BUSINESS_NUMBER = "918329446654";

export default function MessageBubble({ m }) {
  const outbound =
    m.payload_type === "app_sent" ||
    m.from === BUSINESS_NUMBER ||
    m.from === `+${BUSINESS_NUMBER}`;

  return (
    <div className={`flex mb-3 ${outbound ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[78%]">
        <div
          className={`px-3 py-2 rounded-lg text-sm break-words shadow ${
            outbound ? "bg-green-100 text-black" : "bg-white text-black"
          }`}
        >
          {m.text}
        </div>
        <div
          className={`flex items-center gap-2 mt-1 text-xs ${
            outbound ? "justify-end" : ""
          }`}
        >
          <span className="text-gray-500">{formatTS(m.timestamp)}</span>
          {outbound && <StatusTicks status={m.status} />}
        </div>
      </div>
    </div>
  );
}
