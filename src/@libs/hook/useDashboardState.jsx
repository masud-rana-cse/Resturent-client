// src/hooks/useDashboardState.js
import { useMemo } from "react";
import useOrdersState from "./useOrdersState";
import useProductsState from "./useProductState";
import useUsersState from "./useUserState";

const RECENT_ORDERS_LIMIT = 6;

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatItemsLabel(items = []) {
  if (!items.length) return "—";
  const first = items[0];
  const qty = first.qty || 1;
  const label = `${first.name}${qty > 1 ? ` × ${qty}` : ""}`;
  return items.length > 1 ? `${label} +${items.length - 1} more` : label;
}

/**
 * Central data hook for the admin Dashboard.
 * Does NOT fetch anything itself — it composes useOrdersState() and
 * useProductsState(), which already own the network calls, caching,
 * and toast/error handling for their domains. This hook only shapes
 * that data into what the dashboard widgets need.
 */
export default function useDashboardState() {
  const {
    orders,
    stats: orderStats,
    isLoading: ordersLoading,
    error: ordersError,
    refresh: refreshOrders,
  } = useOrdersState();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    refresh: refreshProducts,
  } = useProductsState();
  const {
    users,
    loading: usersLoading,
    error: usersError,
    refresh: refreshUsers,
  } = useUsersState();
  const isLoading = ordersLoading || productsLoading;
  const error = ordersError || productsError;

  // ── Top stat cards ────────────────────────────────────────────────────
  // NOTE: there's no /users endpoint yet, so totalUsers has nowhere to come
  // from. Left at 0 with a clear marker rather than faking a number —
  // wire this up to a real GET /users/count (or similar) when that API
  // exists, then swap this line for the real value.
  const totalUsers = users.length;

  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalOrders = orderStats?.totalOrders ?? orders.length;
  const totalProducts = products?.length;

  // ── Recent orders (most recent N, newest first) ──────────────────────
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, RECENT_ORDERS_LIMIT)
      .map((o) => ({
        id: o.orderId || o._id || o.id,
        customer: o.customer?.name || "Unknown",
        item: formatItemsLabel(o.items),
        total: `$${(o.total || 0).toFixed(2)}`,
        status: o.status,
        date: formatDate(o.createdAt),
      }));
  }, [orders]);

  // ── Quick stats row ───────────────────────────────────────────────────
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orderStats?.statusCounts?.Pending ?? 0;
  const cancelledOrders = orderStats?.statusCounts?.Cancelled ?? 0;
  const cancellationRate =
    totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

  const quickStats = [
    {
      label: "Avg. Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
      sub: "Per order overall",
    },
    {
      label: "Pending Orders",
      value: String(pendingOrders),
      sub: "Require action",
    },
    {
      label: "Cancellation Rate",
      value: `${cancellationRate.toFixed(1)}%`,
      sub: `${cancelledOrders} of ${totalOrders} orders`,
    },
  ];

  const refresh = () => {
    refreshOrders();
    refreshProducts();
  };

  return {
    isLoading,
    error,

    totalOrders,
    totalProducts,
    totalRevenue,
    totalUsers,

    recentOrders,
    quickStats,

    refresh,
  };
}
