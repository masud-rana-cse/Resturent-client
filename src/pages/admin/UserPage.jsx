// src/pages/admin/UserPage.jsx
import React, { useEffect } from "react";
import useUsersState from "../../@libs/hook/useUserState";

const getId = (user) => user?._id || user?.id;

function avatarFor(user) {
  if (user.avatar) return user.avatar;
  const colors = ["f97316", "7c3aed", "ec4899", "0ea5e9", "10b981", "f43f5e"];
  const color = colors[(user.name || "U").charCodeAt(0) % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=${color}&color=fff&size=128`;
}

function formatJoined(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Confirm modal (delete) ────────────────────────────────────────────────────
function ConfirmModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-7 h-7 text-red-500"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="17" y1="8" x2="23" y2="14" />
            <line x1="23" y1="8" x2="17" y2="14" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#1e2a3a] mb-1">Remove User?</h3>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-[#1e2a3a]">
            {user.name || user.email}
          </span>{" "}
          will be permanently removed from the system.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── User Detail Drawer ────────────────────────────────────────────────────────
function UserDrawer({ user, onClose, onRoleChange }) {
  const INFO_ROWS = [
    { icon: "📧", label: "Email", value: user.email || "—" },
    { icon: "📱", label: "Phone", value: user.phone || "—" },
    { icon: "📍", label: "Address", value: user.address || "—" },
    { icon: "📦", label: "Orders", value: `${user.orders} orders placed` },
    { icon: "📅", label: "Joined", value: formatJoined(user.createdAt) },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[360px] max-w-full bg-white z-50 shadow-2xl flex flex-col animate-[slideIn_0.3s_ease]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-bold text-[#1e2a3a]">User Details</h3>
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
            <img
              src={avatarFor(user)}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#f97316]/20 mb-3"
            />
            <h4 className="text-xl font-extrabold text-[#1e2a3a]">
              {user.name || "Unnamed user"}
            </h4>
            <span
              className={`mt-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === "admin"
                  ? "bg-[#f97316]/15 text-[#f97316]"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {INFO_ROWS.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-[#1e2a3a] mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Change Role
            </p>
            <div className="flex gap-2">
              {["user", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => onRoleChange(getId(user), role)}
                  disabled={user.role === role}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                    user.role === role
                      ? "bg-[#f97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-[#f97316] hover:text-[#f97316]"
                  }`}
                >
                  {role === "admin" ? "👑 Admin" : "👤 User"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl animate-[slideUp_0.3s_ease] ${
        type === "error" ? "bg-red-500" : "bg-emerald-500"
      }`}
    >
      {msg}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

// ── UserPage ──────────────────────────────────────────────────────────────────
export default function UserPage() {
  const {
    users,
    loading,
    error,
    adminCount,
    userCount,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    drawer,
    setDrawer,
    deleteTarget,
    setDeleteTarget,
    toast,
    handleRoleChange,
    handleDelete,
    refresh,
  } = useUsersState();

  useEffect(() => {
    const el = document.getElementById("admin-page-title");
    if (el) el.textContent = "Users";
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1e2a3a]">Users</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {users.length} total · {adminCount} admin · {userCount} users
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {["All", "admin", "user"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filterRole === role
                  ? "bg-[#f97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-[#f97316] hover:text-[#f97316]"
              }`}
            >
              {role === "admin"
                ? "👑 Admin"
                : role === "user"
                  ? "👤 User"
                  : "All"}
            </button>
          ))}
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ⟳
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
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
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 transition-all"
          />
        </div>
      </div>

      {/* ── User cards grid ── */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400 text-sm">
          Loading users…
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-gray-500 font-medium">{error}</p>
          <button
            onClick={refresh}
            className="mt-3 text-[#f97316] font-semibold text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-400 font-medium">No users found</p>
          <p className="text-gray-300 text-sm mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={getId(user)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarFor(user)}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-[#1e2a3a] text-sm leading-tight">
                      {user.name || "Unnamed"}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[140px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setDrawer(user)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors"
                    title="View details"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    title="Delete user"
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
              </div>

              <div className="flex items-center gap-4 py-3 border-t border-gray-50">
                <div className="text-center flex-1">
                  <p className="text-lg font-extrabold text-[#1e2a3a]">
                    {user.orders}
                  </p>
                  <p className="text-xs text-gray-400">Orders</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-400 mb-1">Joined</p>
                  <p className="text-xs font-semibold text-[#1e2a3a]">
                    {formatJoined(user.createdAt)}
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="flex-1 flex justify-center">
                  <button
                    onClick={() =>
                      handleRoleChange(
                        getId(user),
                        user.role === "admin" ? "user" : "admin",
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                      user.role === "admin"
                        ? "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20 hover:bg-[#f97316]/20"
                        : "bg-blue-50 text-blue-500 border-blue-100 hover:bg-blue-100"
                    }`}
                    title="Click to toggle role"
                  >
                    {user.role === "admin" ? "👑 Admin" : "👤 User"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {drawer && (
        <UserDrawer
          user={drawer}
          onClose={() => setDrawer(null)}
          onRoleChange={handleRoleChange}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast msg={toast?.msg} type={toast?.type} />
    </div>
  );
}
