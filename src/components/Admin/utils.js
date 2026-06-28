export const STATUS_CONFIG = {
  Pending: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  Processing: { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  Delivered: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
  },
  Cancelled: { badge: "bg-red-100 text-red-600", dot: "bg-red-400" },
};
export function formatDateTime(isoString) {
  if (!isoString) return { date: "—", time: "—" };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}
export function orderId(order) {
  return order?.orderId || order?._id;
}
export function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );

  if (hour < 6) {
    return "Good night";
  }

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}
