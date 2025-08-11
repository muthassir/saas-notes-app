export function formatTS(ts) {
  if (!ts) return "";
  const n = Number(ts);
  if (Number.isNaN(n)) return "";
  const d = new Date(n * 1000);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleString();
}
