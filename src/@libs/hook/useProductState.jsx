import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";

export const CATEGORIES = [
  "Noodles",
  "Pasta",
  "Rice",
  "Seafood",
  "Burgers",
  "Desserts",
  "Drinks",
];

const DEBOUNCE_TIME = 400;
const TOAST_TIME = 3000;

const getId = (product) => product?._id || product?.id;

const getError = (error, fallback = "Something went wrong") => {
  return error?.response?.data?.message || error?.message || fallback;
};

export default function useProductsState() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [modal, setModal] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);

  const [toast, setToast] = useState(null);

  const timerRef = useRef(null);

  /*
 Toast
*/
  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ msg, type });
    timerRef.current = setTimeout(
      () => setToast({ msg: "", type: "success" }),
      TOAST_TIME,
    );
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  /*
 Fetch products
*/

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const params = {};

      if (search.trim()) params.search = search;

      if (category !== "All") params.category = category;

      const res = await AxiosInstance.get("/products", {
        params,
      });

      setProducts(res.data.data || []);
    } catch (err) {
      const message = getError(err, "Failed to load products");

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, category, showToast]);

  /*
 Search debounce
*/

  useEffect(() => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(
      () => {
        fetchProducts();
      },
      search ? DEBOUNCE_TIME : 0,
    );

    return () => clearTimeout(timerRef.current);
  }, [fetchProducts]);

  /*
 Add Product
*/

  const addProduct = async (data) => {
    try {
      await AxiosInstance.post("/products/add-product", data);

      showToast(`${data.name} added`);

      setModal(null);

      fetchProducts();

      return true;
    } catch (err) {
      showToast(getError(err, "Add failed"), "error");

      return false;
    }
  };

  /*
 Update Product
*/

  const updateProduct = async (data) => {
    if (!modal) return false;

    const id = getId(modal);

    try {
      await AxiosInstance.patch(`/products/${id}`, data);

      setProducts((prev) =>
        prev.map((product) =>
          getId(product) === id
            ? {
                ...product,
                ...data,
              }
            : product,
        ),
      );

      showToast(`${data.name} updated`);

      setModal(null);

      return true;
    } catch (err) {
      showToast(getError(err, "Update failed"), "error");

      return false;
    }
  };

  /*
 Save (add/update)
*/

  const saveProduct = (data) => {
    return modal === "add" ? addProduct(data) : updateProduct(data);
  };

  /*
 Delete
*/

  const deleteProduct = async () => {
    if (!deleteItem) return;

    const id = getId(deleteItem);
    try {
      await AxiosInstance.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((item) => getId(item) !== id));

      showToast(`${deleteItem.name} deleted`, "error");
    } catch (err) {
      showToast(getError(err, "Delete failed"), "error");
    } finally {
      setDeleteItem(null);
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await AxiosInstance.get(`/products/${id}`);

      return res.data.data;
    } catch (err) {
      showToast(getError(err), "error");

      return null;
    }
  };

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);

  const outOfStock = products.filter((p) => p.stock <= 0);

  return {
    /* data */

    products,

    loading,

    error,

    /* filters */

    search,

    setSearch,

    category,

    setCategory,

    CATEGORIES,

    /* modal */

    modal,

    setModal,

    deleteItem,

    setDeleteItem,

    toast,

    /* actions */

    saveProduct,

    deleteProduct,

    getProduct,

    refresh: fetchProducts,

    /* derived */

    lowStock,

    outOfStock,
  };
}
