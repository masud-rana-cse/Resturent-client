// src/hooks/useUsersState.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";
import useOrdersState from "./useOrdersState";

const DEBOUNCE_TIME = 400;
const TOAST_TIME = 3000;

const getId = (user) => user?._id || user?.id;

const getError = (error, fallback = "Something went wrong") => {
  return error?.response?.data?.message || error?.message || fallback;
};

/**
 * Central data + UI-state hook for the admin Users page.
 * Mirrors useOrdersState / useProductsState (fetch + delete + toast +
 * modal/drawer targets) so all three admin pages behave consistently.
 *
 * Per-user order counts come from useOrdersState() rather than a separate
 * fetch or a count baked into the user document — orders are already
 * loaded there, so this just tallies them by user.
 */
export default function useUsersState() {
  const { orders } = useOrdersState();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // UI targets
  const [drawer, setDrawer] = useState(null); // user being viewed
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const timerRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ msg, type });
    timerRef.current = setTimeout(
      () => setToast({ msg: "", type: "success" }),
      TOAST_TIME,
    );
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ── Fetching ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search;
      if (filterRole !== "All") params.role = filterRole;

      const res = await AxiosInstance.get("/users", { params });
      setUsers(res.data.data || []);
    } catch (err) {
      const message = getError(err, "Failed to load users");
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterRole, showToast]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchUsers, search ? DEBOUNCE_TIME : 0);
    return () => clearTimeout(timerRef.current);
  }, [fetchUsers, search]);

  // ── Mutations ───────────────────────────────────────────────────────────
  const handleRoleChange = useCallback(
    async (id, newRole) => {
      try {
        await AxiosInstance.patch(`/users/${id}/role`, { role: newRole });
        setUsers((prev) =>
          prev.map((u) => (getId(u) === id ? { ...u, role: newRole } : u)),
        );
        setDrawer((d) => (d && getId(d) === id ? { ...d, role: newRole } : d));
        showToast(`Role updated to ${newRole}`);
      } catch (err) {
        showToast(getError(err, "Failed to update role"), "error");
      }
    },
    [showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = getId(deleteTarget);
    try {
      await AxiosInstance.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => getId(u) !== id));
      setDrawer((d) => (d && getId(d) === id ? null : d));
      showToast(`${deleteTarget.name || "User"} removed`, "error");
    } catch (err) {
      showToast(getError(err, "Failed to delete user"), "error");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, showToast]);

  const getUser = useCallback(
    async (id) => {
      try {
        const res = await AxiosInstance.get(`/users/${id}`);
        return res.data.data;
      } catch (err) {
        showToast(getError(err), "error");
        return null;
      }
    },
    [showToast],
  );

  // ── Derived: order counts per user, sourced from useOrdersState ─────────
  const orderCountsByUser = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const key = o.userId || o.customer?.email;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const usersWithOrderCounts = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        orders: orderCountsByUser[getId(u)] ?? orderCountsByUser[u.email] ?? 0,
      })),
    [users, orderCountsByUser],
  );
    const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === "admin";

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role !== "admin").length;

  return {
    // data
    users: usersWithOrderCounts,
    loading,
    error,
    isAdmin,
    adminCount,
    userCount,

    // filters
    search,
    setSearch,
    filterRole,
    setFilterRole,

    // UI targets
    drawer,
    setDrawer,
    deleteTarget,
    setDeleteTarget,
    toast,

    // actions
    handleRoleChange,
    handleDelete,
    getUser,
    refresh: fetchUsers,
  };
}
