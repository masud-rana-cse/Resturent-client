import { useState } from "react";
import BaseImageUpload from "../../../@base/BaseImageUpload";

const EMPTY_FORM = {
  name: "",
  category: "Noodles",
  price: "",
  stock: "",
  image: "",
};
export default function ProductModal({ product, categories, onSave, onClose }) {
  const isEdit = Boolean(product && product !== "add");
  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          image: product.image,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.price || form.price <= 0) e.price = "Enter a valid price";
    if (form.stock === "" || form.stock < 0) e.stock = "Enter valid stock";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setIsSubmitting(true);
    await onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
    setIsSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2a3a]">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Image URL
              </label>
              <BaseImageUpload
                value={form.image}
                onChange={(url) => set("image", url)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Grilled Salmon"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#f97316]/10 ${
                errors.name
                  ? "border-red-400"
                  : "border-gray-200 focus:border-[#f97316]"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 bg-white transition-all"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#f97316]/10 ${
                  errors.price
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#f97316]"
                }`}
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Stock <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#f97316]/10 ${
                  errors.stock
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#f97316]"
                }`}
              />
              {errors.stock && (
                <p className="text-red-400 text-xs mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.3)]  cursor-pointer"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
