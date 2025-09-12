import { useEffect, useState } from "react";
import API from "../base_api/api";
import { FaTrash, FaTags, FaPlus } from "react-icons/fa";
import ToastMessage from "../toastmessage/ToastMessage";

const DonationCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // Confirm Delete Modal
  const [confirmModal, setConfirmModal] = useState({ open: false, categoryId: null });

  // Add Category Modal
  const [addModal, setAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("categories/");
      setCategories(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  // Confirm Delete
  const confirmDeleteCategory = (id) => {
    setConfirmModal({ open: true, categoryId: id });
  };

  // Delete Category
  const deleteCategory = async () => {
    const id = confirmModal.categoryId;
    if (!id) return;

    try {
      await API.delete(`categories/${id}/`);
      const deleted = categories.find((c) => c.id === id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast(`Category "${deleted?.name}" deleted successfully`, "success");
    } catch (error) {
      console.error("Failed to delete category:", error);
      showToast("Failed to delete category", "error");
    } finally {
      setConfirmModal({ open: false, categoryId: null });
    }
  };

  // Add Category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Category name cannot be empty", "error");
      return;
    }

    try {
      const res = await API.post("categories/", { name: newCategory });
      setCategories((prev) => [...prev, res.data]);
      showToast(`Category "${res.data.name}" added successfully`, "success");
      setNewCategory("");
      setAddModal(false);
    } catch (error) {
      console.error("Failed to add category:", error);
      showToast("Failed to add category", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F74F22] mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <h1 className="text-white text-2xl sm:text-3xl font-bold">Donation Categories</h1>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition "
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="bg-white shadow-md rounded-lg h-full flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="bg-[#F74F22] text-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 py-3 text-sm sm:text-base font-semibold">
              <div className="text-left">Category Name</div>
              <div className="hidden sm:block text-left">ID</div>
              <div className="text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-auto">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                <FaTags className="text-3xl sm:text-4xl mb-2 opacity-50" />
                <p className="text-sm sm:text-base">No categories found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 py-3 hover:bg-red-50 transition text-sm sm:text-base"
                  >
                    <div className="font-semibold">{c.name}</div>
                    <div className="hidden sm:block">{c.id}</div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => confirmDeleteCategory(c.id)}
                        className="text-[#F74F22] hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                        title="Delete Category"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <FaTrash className="text-red-500 text-3xl mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={deleteCategory}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmModal({ open: false, categoryId: null })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAddModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                className="bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCategories;
