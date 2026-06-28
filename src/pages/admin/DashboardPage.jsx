import React, { useEffect } from "react";
import { StatCard } from "../../components/Admin/dashboard/StatCard";
import useDashboardState from "../../@libs/hook/useDashboardState";
import { getGreeting } from "../../components/Admin/utils";

const STATUS_STYLES = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100  text-amber-700",
  Processing: "bg-blue-100   text-blue-700",
  Cancelled: "bg-red-100    text-red-600",
};

const ICONS = {
  orders: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-7 h-7 text-white"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-7 h-7 text-white"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  products: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-7 h-7 text-white"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  revenue: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-7 h-7 text-white"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

export default function DashboardPage() {
  const {
    isLoading,
    error,
    totalOrders,
    totalProducts,
    totalRevenue,
    totalUsers,
    recentOrders,
    quickStats,
    refresh,
  } = useDashboardState();

  useEffect(() => {
    const el = document.getElementById("admin-page-title");
    if (el) el.textContent = "Dashboard";
  }, []);

  const statCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      prefix: "",
      suffix: "",
      gradient: "from-[#7c3aed] to-[#a855f7]",
      icon: ICONS.orders,
    },
    {
      label: "Total Users",
      // null means there's no /users endpoint wired up yet — see useDashboardState
      value: totalUsers ?? "—",
      prefix: "",
      suffix: "",
      gradient: "from-[#ec4899] to-[#f43f5e]",
      icon: ICONS.users,
    },
    {
      label: "Total Products",
      value: totalProducts,
      prefix: "",
      suffix: "",
      gradient: "from-[#0ea5e9] to-[#38bdf8]",
      icon: ICONS.products,
    },
    {
      label: "Total Revenue",
      value: totalRevenue.toFixed(2),
      prefix: "$",
      suffix: "",
      gradient: "from-[#10b981] to-[#34d399]",
      icon: ICONS.revenue,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1e2a3a]">
            {getGreeting()}, Admin 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your restaurant today.
          </p>
        </div>
        <button
          onClick={refresh}
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          ⟳ Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards?.map((s) => (
          <StatCard key={s.label} {...s} loading={isLoading} />
        ))}
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#1e2a3a] text-base">Recent Orders</h3>
          <span className="text-xs text-gray-400 font-medium">
            Most recent {recentOrders?.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Loading orders…
            </div>
          ) : recentOrders?.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No orders yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders?.map((order) => (
                  <tr
                    key={order?.id}
                    className="hover:bg-gray-50/70 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-[#f97316]">
                      #{order?.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1e2a3a]">
                      {order?.customer}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order?.item}</td>
                    <td className="px-6 py-4 font-bold text-[#1e2a3a]">
                      {order?.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order?.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {order?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {order?.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
          <a
            href="/admin/orders"
            className="text-sm text-[#f97316] font-semibold hover:underline"
          >
            View all orders →
          </a>
        </div>
      </div>

      {/* ── Quick Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {quickStats.map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100"
          >
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-2xl font-extrabold text-[#1e2a3a]">
              {isLoading ? "—" : value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
