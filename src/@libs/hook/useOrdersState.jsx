// src/hooks/useOrdersState.js
import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";

export const ALL_STATUSES = ["Pending", "Processing", "Delivered", "Cancelled"];

const DEFAULT_STATS = {
  statusCounts: { Pending: 0, Processing: 0, Delivered: 0, Cancelled: 0 },
  totalOrders: 0,
  totalRevenue: 0,
};

const TOAST_DURATION = 3000;
const SEARCH_DEBOUNCE = 350;

const getId = (order) => order?._id || order?.id;

/** Pull a user-facing message out of an axios error, with a sane fallback. */
function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

/**
 * Central data + UI-state hook for the admin Orders page.
 * Handles: fetching orders (server-side search/filter), stats,
 * status updates, deletes, toasts, and all modal/drawer targets.
 */
export default function useOrdersState() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI targets
  const [drawer, setDrawer] = useState(null); // order being viewed
  const [statusTarget, setStatusTarget] = useState(null); // order being status-edited
  const [deleteTarget, setDeleteTarget] = useState(null); // order pending delete
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const debounceRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setToast({ msg, type });
    toastTimerRef.current = setTimeout(
      () => setToast({ msg: "", type: "success" }),
      TOAST_DURATION,
    );
  }, []);

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // ── Fetching ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus !== "All") params.status = filterStatus;

      const { data } = await AxiosInstance.get("/orders", { params });
      setOrders(data.data || []);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load orders");
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [search, filterStatus, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await AxiosInstance.get("/orders/stats");
      setStats(data.data || DEFAULT_STATS);
    } catch {
      // stats are non-critical — fail silently, table still works
    }
  }, []);

  const refresh = useCallback(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  // initial stats load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // refetch orders whenever search/filter changes (debounced for search only)
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchOrders, search ? SEARCH_DEBOUNCE : 0);
    return () => clearTimeout(debounceRef.current);
  }, [fetchOrders, search]);

  // ── Mutations ───────────────────────────────────────────────────────────
  const handleStatusSave = useCallback(
    async (newStatus) => {
      if (!statusTarget) return;
      const id = getId(statusTarget);
      try {
        await AxiosInstance.patch(`/orders/${id}/status`, {
          status: newStatus,
        });
        setOrders((prev) =>
          prev.map((o) => (getId(o) === id ? { ...o, status: newStatus } : o)),
        );
        setDrawer((d) =>
          d && getId(d) === id ? { ...d, status: newStatus } : d,
        );
        showToast(
          `✅ Order #${statusTarget.orderId || id} marked as ${newStatus}`,
        );
        fetchStats();
      } catch (err) {
        showToast(getErrorMessage(err, "Failed to update status"), "error");
      } finally {
        setStatusTarget(null);
      }
    },
    [statusTarget, showToast, fetchStats],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = getId(deleteTarget);
    try {
      await AxiosInstance.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => getId(o) !== id));
      setDrawer((d) => (d && getId(d) === id ? null : d));
      showToast(`Order #${deleteTarget.orderId || id} deleted`, "error");
      fetchStats();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to delete order"), "error");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, showToast, fetchStats]);

  const fetchOrderById = useCallback(
    async (id) => {
      try {
        const { data } = await AxiosInstance.get(`/orders/${id}`);
        return data.data;
      } catch (err) {
        showToast(getErrorMessage(err, "Failed to load order"), "error");
        return null;
      }
    },
    [showToast],
  );

  const placeOrder = useCallback(
    async ({ items, userId, customer }) => {
      try {
        const { data } = await AxiosInstance.post("/orders/place-order", {
          items,
          userId,
          customer,
        });
        showToast(
          `Order placed successfully${data.orderId ? ` (#${data.orderId})` : ""}`,
        );
        refresh();
        return data;
      } catch (err) {
        showToast(getErrorMessage(err, "Failed to place order"), "error");
        return null;
      }
    },
    [showToast, refresh],
  );

  return {
    // data
    orders,
    stats,
    isLoading,
    error,

    // search/filter
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    ALL_STATUSES,

    // UI targets
    drawer,
    setDrawer,
    statusTarget,
    setStatusTarget,
    deleteTarget,
    setDeleteTarget,
    toast,

    // actions
    handleStatusSave,
    handleDelete,
    fetchOrderById,
    placeOrder,
    refresh,
  };
}
