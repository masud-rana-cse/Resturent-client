// src/pages/admin/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import useProductsState from "../../@libs/hook/useProductState";
import CustomToast from "../../@base/CustomToast";
import { ConfirmModal } from "../../components/Admin/orders/ConfirmModal";
import ProductModal from "../../components/Admin/Products/ProductModal";
import BaseLoader from "../../@base/BaseLoader";

const getId = (product) => product?._id || product?.id;

// ── ProductsPage ──────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    CATEGORIES,
    search,
    setSearch,
    category,
    setCategory,
    modal,
    setModal,
    deleteItem,
    setDeleteItem,
    toast,
    saveProduct,
    deleteProduct,
    refresh,
    hasPendingOrders,
    lowStockProducts,
  } = useProductsState();

  useEffect(() => {
    const el = document.getElementById("admin-page-title");
    if (el) el.textContent = "Products";
  }, []);

  const allCategories = ["All", ...CATEGORIES];

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1e2a3a]">Products</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {products.length} total items on the menu
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={refresh}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors  cursor-pointer"
          >
            ⟳ Refresh
          </button>
          <button
            onClick={() => setModal("add")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-sm rounded-xl transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.3)] cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-4 h-4"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* ── Low-stock-while-pending-orders banner (cross-referenced via useOrdersState) ── */}
      {hasPendingOrders && lowStockProducts?.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
          <span className="text-lg">⚠️</span>
          <span>
            <strong>{lowStockProducts.length}</strong> product
            {lowStockProducts.length > 1 ? "s" : ""} running low on stock while
            there are pending orders. Consider restocking soon.
          </span>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories?.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                category === cat
                  ? "bg-[#f97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <BaseLoader className={"flex justify-center mt-10"} />
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
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-400 font-medium">No products found</p>
            <p className="text-gray-300 text-sm mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  {/* <th className="px-6 py-4">Stock</th> */}
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products?.map((p) => (
                  <tr
                    key={getId(p)}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              🍽️
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-[#1e2a3a]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#f97316]/10 text-[#f97316] text-xs font-semibold px-3 py-1 rounded-full">
                        {p.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1e2a3a]">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    {/* <td className="px-6 py-4 text-gray-500">{p.stock} Ps</td> */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          p.stock > 5
                            ? "bg-emerald-100 text-emerald-700"
                            : p.stock > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.stock > 5
                          ? "In Stock"
                          : p.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(p)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="w-4 h-4"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteItem(p)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                          title="Delete"
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {products.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {products.length} products
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modal && (
        <ProductModal
          product={modal}
          categories={CATEGORIES}
          onSave={saveProduct}
          onClose={() => setModal(null)}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          product={deleteItem}
          onConfirm={deleteProduct}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      <CustomToast msg={toast?.msg} type={toast?.type} />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
