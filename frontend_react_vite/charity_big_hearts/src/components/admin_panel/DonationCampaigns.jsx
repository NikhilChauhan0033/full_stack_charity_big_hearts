import { useEffect, useState } from "react";
import API from "../base_api/api";
import { FaTrash, FaPlus, FaEdit, FaBullhorn, FaRupeeSign, FaTags, FaBullseye  } from "react-icons/fa";
import ToastMessage from "../toastmessage/ToastMessage";

const DonationCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // Add/Edit Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  // Confirm Delete Modal
  const [confirmModal, setConfirmModal] = useState({ open: false, campaignId: null });

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    goal_amount: "",
    raised_amount: "",
    category: "",
    image: null,
  });

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

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await API.get("admin-donations/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      showToast("Failed to fetch campaigns", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await API.get("categories/");
      setCategories(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchCategories();
  }, []);

  // Add campaign
  const addCampaign = async () => {
    if (!newCampaign.title.trim()) {
      showToast("Campaign title is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", newCampaign.title);
    formData.append("goal_amount", newCampaign.goal_amount);
    formData.append("raised_amount", newCampaign.raised_amount || 0);
    formData.append("category", newCampaign.category);
    if (newCampaign.image) formData.append("image", newCampaign.image);

    try {
      await API.post("donations/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Campaign added successfully!", "success");
      setNewCampaign({ title: "", goal_amount: "", raised_amount: "", category: "", image: null });
      setAddModal(false);
      fetchCampaigns();
    } catch (error) {
      console.error("Failed to add campaign:", error);
      showToast("Failed to add campaign", "error");
    }
  };

  // Confirm delete
  const confirmDeleteCampaign = (id) => {
    setConfirmModal({ open: true, campaignId: id });
  };

  // Delete campaign
  const deleteCampaign = async () => {
    const id = confirmModal.campaignId;
    if (!id) return;

    try {
      await API.delete(`donations/${id}/`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      showToast("Campaign deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      showToast("Failed to delete campaign", "error");
    } finally {
      setConfirmModal({ open: false, campaignId: null });
    }
  };

  // Update campaign
  const updateCampaign = async () => {
    if (!editModal) return;
    const formData = new FormData();
    formData.append("title", editModal.title);
    formData.append("goal_amount", editModal.goal_amount);
    formData.append("raised_amount", editModal.raised_amount || 0);
    formData.append("category", editModal.category);
    if (editModal.image instanceof File) {
      formData.append("image", editModal.image);
    }

    try {
      await API.patch(`donations/${editModal.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Campaign updated successfully!", "success");
      setEditModal(null);
      fetchCampaigns();
    } catch (error) {
      console.error("Failed to update campaign:", error);
      showToast("Failed to update campaign", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F74F22] mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <title>Admin Panel All Donation Campaigns - BigHearts</title>
      {/* Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold">Donation Campaigns</h1>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F74F22] text-white">
              <FaBullhorn className="mr-2" />
              {campaigns.length} Campaigns
            </span>
          </div>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition "
        >
          <FaPlus /> Add Campaign
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {/* Mobile and tablet Card Layout */}
        <div className="md:hidden h-full">
          <div className="px-4 pb-4 h-full">
            <div className="h-full overflow-y-auto">
              {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FaBullhorn className="text-5xl mb-4 opacity-50" />
                  <p className="text-lg">No campaigns found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((c) => (
                    <div 
                      key={c.id} 
                      className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Campaign Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <FaBullhorn className="text-gray-400 mr-2 text-sm" />
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                              {c.title}
                            </h3>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => setEditModal(c)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Campaign"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => confirmDeleteCampaign(c.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Campaign"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Campaign Details */}
                      <div className="space-y-3">
                        {/* Goal & Raised Amount */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center text-green-600 mb-1">
                              <FaBullseye  className="mr-2 text-sm" />
                              <span className="text-xs font-medium">Goal</span>
                            </div>
                            <p className="font-bold text-green-700">₹{c.goal_amount}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center text-blue-600 mb-1">
                              <FaRupeeSign className="mr-2 text-sm" />
                              <span className="text-xs font-medium">Raised</span>
                            </div>
                            <p className="font-bold text-blue-700">₹{c.raised_amount || 0}</p>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="flex items-center">
                          <FaTags className="text-gray-400 mr-3 text-sm flex-shrink-0" />
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-50 rounded-full">
                            {categories.find((cat) => cat.id === c.category)?.name || c.category}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {c.goal_amount && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{Math.round((c.raised_amount || 0) / c.goal_amount * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#F74F22] h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, ((c.raised_amount || 0) / c.goal_amount * 100))}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Remaining Amount */}
                        {c.to_go && (
                          <div className="text-center pt-2 border-t">
                            <span className="text-sm text-gray-600">Still needed: </span>
                            <span className="font-bold text-red-600">₹{c.to_go}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block h-full px-6 pb-6">
          <div className="bg-white shadow-md rounded-lg h-full flex flex-col overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#F74F22] text-white">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold">
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Goal</div>
                <div className="col-span-2">Raised</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">To Go</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-auto">
              {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                  <FaBullhorn className="text-4xl mb-2 opacity-50" />
                  <p className="text-base">No campaigns found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {campaigns.map((c) => (
                    <div
                      key={c.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-red-50 transition text-sm"
                    >
                      <div className="col-span-4 font-semibold">{c.title}</div>
                      <div className="col-span-2">₹{c.goal_amount}</div>
                      <div className="col-span-2">₹{c.raised_amount || 0}</div>
                      <div className="col-span-2">
                        {categories.find((cat) => cat.id === c.category)?.name || c.category}
                      </div>
                      <div className="col-span-1">₹{c.to_go || 0}</div>
                      <div className="col-span-1 flex justify-center gap-3">
                        <button
                          onClick={() => setEditModal(c)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded transition"
                          title="Edit Campaign"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDeleteCampaign(c.id)}
                          className="text-[#F74F22] hover:text-red-600 p-2 rounded transition"
                          title="Delete Campaign"
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
      </div>

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <FaTrash className="text-red-500 text-3xl mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={deleteCampaign}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmModal({ open: false, campaignId: null })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Campaign</h2>
            <input
              type="text"
              placeholder="Title"
              value={newCampaign.title}
              onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="number"
              placeholder="Goal Amount"
              value={newCampaign.goal_amount}
              onChange={(e) => setNewCampaign({ ...newCampaign, goal_amount: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="number"
              placeholder="Raised Amount"
              value={newCampaign.raised_amount}
              onChange={(e) => setNewCampaign({ ...newCampaign, raised_amount: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <select
              value={newCampaign.category}
              onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              onChange={(e) => setNewCampaign({ ...newCampaign, image: e.target.files[0] })}
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
                onClick={addCampaign}
                className="bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Campaign</h2>
            <input
              type="text"
              value={editModal.title}
              onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="number"
              value={editModal.goal_amount}
              onChange={(e) => setEditModal({ ...editModal, goal_amount: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="number"
              value={editModal.raised_amount}
              onChange={(e) => setEditModal({ ...editModal, raised_amount: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <select
              value={editModal.category}
              onChange={(e) => setEditModal({ ...editModal, category: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              onChange={(e) => setEditModal({ ...editModal, image: e.target.files[0] })}
              className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateCampaign}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCampaigns;