import { useEffect } from "react";
import useOrdersState from "../../@libs/hook/useOrdersState";
import { ConfirmModal } from "../../components/Admin/orders/ConfirmModal";
import OrderDrawer from "../../components/Admin/orders/OrderDrawer";
import StatusModal from "../../components/Admin/orders/StatusModal";
import {
  formatDateTime,
  orderId,
  STATUS_CONFIG,
} from "../../components/Admin/utils";
import { StatusBadge } from "../../components/Admin/orders/StatusBadge";
import BaseLoader from "../../@base/BaseLoader";
import CustomToast from "../../@base/CustomToast";

export default function OrderPage() {
  const {
    orders,
    stats,
    isLoading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    ALL_STATUSES,
    drawer,
    setDrawer,
    statusTarget,
    setStatusTarget,
    deleteTarget,
    setDeleteTarget,
    toast,
    handleStatusSave,
    handleDelete,
    refresh,
  } = useOrdersState();
  useEffect(() => {
    const el = document.getElementById("admin-page-title");
    if (el) el.textContent = "Orders";
  }, []);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1e2a3a]">Orders</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {stats.totalOrders} total orders · ${stats.totalRevenue.toFixed(2)}{" "}
            revenue
          </p>
        </div>
        <button
          onClick={refresh}
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors self-start sm:self-auto"
        >
          ⟳ Refresh
        </button>
      </div>

      {/* Summary stat chips — driven by /orders/stats, not client-side counting */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_STATUSES?.map((status) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              onClick={() =>
                setFilterStatus(filterStatus === status ? "All" : status)
              }
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                filterStatus === status
                  ? "border-[#f97316] bg-[#f97316]/5 shadow-[0_4px_12px_rgba(249,115,22,0.15)]"
                  : "border-gray-100 bg-white hover:border-gray-200 shadow-sm"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`}
              />
              <div>
                <p className="text-xl font-extrabold text-[#1e2a3a] leading-none">
                  {stats.statusCounts[status] ?? 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{status}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search + filter bar — both now hit the server via useOrdersState */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:w-auto">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("All")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === "All"
                ? "bg-[#f97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === s
                  ? "bg-[#f97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <BaseLoader className={'flex justify-center mt-10'} />
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-500 font-medium">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 text-[#f97316] font-semibold text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-400 font-medium">No orders found</p>
            <p className="text-gray-300 text-sm mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const { date, time } = formatDateTime(order.createdAt);
                  return (
                    <tr
                      key={orderId(order)}
                      onClick={() => setDrawer(order)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-[#f97316]">
                        #{String(orderId(order))}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1e2a3a]">
                          {order.customer?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.customer?.email || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.image}
                              alt={item.name}
                              title={item.name}
                              className="w-8 h-8 rounded-lg object-cover border-2 border-white"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1e2a3a]">
                        ${(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 text-xs">{date}</p>
                        <p className="text-gray-700 text-xs mt-0.5">{time}</p>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusTarget(order);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors"
                            title="Update status"
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
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(order);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Delete order"
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
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-700">
            <span>Showing {orders.length} orders</span>
            {filterStatus !== "All" && (
              <button
                onClick={() => setFilterStatus("All")}
                className="text-[#f97316] font-semibold hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {drawer && !statusTarget && !deleteTarget && (
        <OrderDrawer
          order={drawer}
          onClose={() => setDrawer(null)}
          onStatusClick={() => setStatusTarget(drawer)}
          onDeleteClick={() => setDeleteTarget(drawer)}
        />
      )}

      {statusTarget && (
        <StatusModal
          order={statusTarget}
          onSave={handleStatusSave}
          onClose={() => setStatusTarget(null)}
          ALL_STATUSES={ALL_STATUSES}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          order={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <CustomToast msg={toast?.msg} type={toast?.type} />

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
