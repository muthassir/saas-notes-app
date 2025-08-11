import React from "react";

export default function StatusTicks({ status }) {
  if (!status || status === "sent")
    return <span className="text-xs text-gray-500">✓</span>;
  if (status === "delivered")
    return <span className="text-xs text-gray-500">✓✓</span>;
  if (status === "read")
    return <span className="text-xs text-blue-500">✓✓</span>;
  return <span className="text-xs text-gray-500">{status}</span>;
}
