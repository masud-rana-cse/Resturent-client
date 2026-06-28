import { formatDateTime, orderId } from "../utils";
import { StatusBadge } from "./StatusBadge";

export default function OrderDrawer({
  order,
  onClose,
  onStatusClick,
  onDeleteClick,
}) {
  const itemsTotal = order.items.reduce(
    (sum, i) => sum + i.price * (i.qty || 1),
    0,
  );
  const { date, time } = formatDateTime(order.createdAt);

  return (
    <>
      <div
        className="fixed h-full inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white z-50 shadow-2xl flex flex-col"
        style={{ animation: "slideIn 0.3s ease" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-[#1e2a3a]">Order Details</h3>
            <p className="text-xs text-[#f97316] font-semibold mt-0.5">
              #{orderId(order)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-xs text-gray-400">
              {date} · {time}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Customer
            </p>
            {[
              { icon: "👤", value: order.customer?.name || "Unknown" },
              { icon: "📧", value: order.customer?.email || "—" },
              { icon: "📱", value: order.customer?.phone || "—" },
              { icon: "📍", value: order.customer?.address || "—" },
            ].map(({ icon, value }) => (
              <div key={icon} className="flex items-center gap-2.5 text-sm">
                <span className="flex-shrink-0">{icon}</span>
                <span className="text-[#1e2a3a] font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Items ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1e2a3a] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ${item.price.toFixed(2)} × {item.qty || 1}
                    </p>
                  </div>
                  <p className="font-bold text-[#1e2a3a] text-sm flex-shrink-0">
                    ${(item.price * (item.qty || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery fee</span>
              <span>${Math.max(order.total - itemsTotal, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-[#1e2a3a] text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#f97316]">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.note && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-600 mb-1">
                📝 Customer Note
              </p>
              <p className="text-sm text-amber-800">{order.note}</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onDeleteClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
            Delete
          </button>
          <button
            onClick={onStatusClick}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-sm transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
            </svg>
            Update Status
          </button>
        </div>
      </div>
    </>
  );
}
