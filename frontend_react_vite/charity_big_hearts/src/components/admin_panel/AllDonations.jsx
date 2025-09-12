import { useEffect, useState } from "react";
import API from "../base_api/api";
import { FaTrash, FaDonate, FaPlus } from "react-icons/fa";
import ToastMessage from "../toastmessage/ToastMessage";

const AllDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // Confirm Delete Modal
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    donationId: null,
  });

  // Add Donation Modal
  const [addModal, setAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState({
    campaign: "",
    name: "",
    surname: "",
    email: "",
    donation_amount: "",
    payment_mode: "upi",
  });

  // ✅ Campaign list state
  const [campaigns, setCampaigns] = useState([]);

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

  // Fetch donations
  const fetchDonations = async () => {
    try {
      const res = await API.get("donate/");
      setDonations(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch donations:", error);
      showToast("Failed to fetch donations", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await API.get("admin-donations/");
      setCampaigns(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      showToast("Failed to fetch campaigns", "error");
    }
  };

  // Confirm Delete
  const confirmDeleteDonation = (id) => {
    setConfirmModal({ open: true, donationId: id });
  };

  // Delete Donation
  const deleteDonation = async () => {
    const id = confirmModal.donationId;
    if (!id) return;

    try {
      await API.delete(`donate/${id}/`);
      const deleted = donations.find((d) => d.id === id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
      showToast(
        `Donation by "${deleted?.name} ${deleted?.surname}" deleted successfully`,
        "success"
      );
    } catch (error) {
      console.error("Failed to delete donation:", error);
      showToast("Failed to delete donation", "error");
    } finally {
      setConfirmModal({ open: false, donationId: null });
    }
  };

  // Add Donation
  const addDonation = async () => {
    try {
      const res = await API.post("donate/submit/", newDonation);
      setDonations((prev) => [...prev, res.data]);
      showToast(`Donation added successfully`, "success");
      setNewDonation({
        campaign: "",
        name: "",
        surname: "",
        email: "",
        donation_amount: "",
        payment_mode: "upi",
      });
      setAddModal(false);
    } catch (error) {
      console.error("Failed to add donation:", error.response?.data || error);
      showToast("Failed to add donation", "error");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchCampaigns(); // ✅ fetch campaigns also
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F74F22] mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">
            Loading donations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
       <title>Admin Panel All Donations - BigHearts</title>
      {/* Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <h1 className="text-white text-2xl sm:text-3xl font-bold">
          All Donations
        </h1>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition "
        >
          <FaPlus /> Add Donation
        </button>
      </div>

      {/* Table Container */}
      <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="bg-white shadow-md rounded-lg h-full flex flex-col overflow-hidden">
          {/* Horizontal scroll wrapper for header */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header - Fixed */}
              <div className="bg-[#F74F22] text-white">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm sm:text-base font-semibold">
                  <div className="col-span-2">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Campaign</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Payment</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>

              {/* Horizontal scroll wrapper for body with INNER vertical scroll */}
              <div className="flex-1 overflow-x-auto">
                <div className="min-w-[800px] h-full">
                  {/* Table Body with INNER vertical scroll */}
                  <div className="h-full overflow-y-auto">
                    {donations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
                        <FaDonate className="text-3xl sm:text-4xl mb-2 opacity-50" />
                        <p className="text-sm sm:text-base">
                          No donations found
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {donations.map((d) => (
                          <div
                            key={d.id}
                            className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-red-50 transition text-sm sm:text-base"
                          >
                            <div className="col-span-2 break-words">
                              {d.name} {d.surname}
                            </div>
                            <div className="col-span-3 break-all leading-tight">
                              {d.email}
                            </div>
                            <div className="col-span-2 break-words">
                              {d.campaign}
                            </div>
                            <div className="col-span-2">
                              ₹{d.donation_amount}
                            </div>
                            <div className="col-span-2 capitalize">
                              {d.payment_mode}
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <button
                                onClick={() => confirmDeleteDonation(d.id)}
                                className="text-[#F74F22] hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                                title="Delete Donation"
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
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <FaTrash className="text-red-500 text-3xl mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this donation? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={deleteDonation}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() =>
                  setConfirmModal({ open: false, donationId: null })
                }
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Donation Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Donation
            </h2>

            {/* ✅ Campaign Dropdown */}
            <select
              value={newDonation.campaign}
              onChange={(e) =>
                setNewDonation({ ...newDonation, campaign: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            >
              <option value="">Select Campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title || c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="First Name"
              value={newDonation.name}
              onChange={(e) =>
                setNewDonation({ ...newDonation, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="text"
              placeholder="Surname"
              value={newDonation.surname}
              onChange={(e) =>
                setNewDonation({ ...newDonation, surname: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="email"
              placeholder="Email"
              value={newDonation.email}
              onChange={(e) =>
                setNewDonation({ ...newDonation, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="number"
              placeholder="Donation Amount"
              value={newDonation.donation_amount}
              onChange={(e) =>
                setNewDonation({
                  ...newDonation,
                  donation_amount: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <select
              value={newDonation.payment_mode}
              onChange={(e) =>
                setNewDonation({ ...newDonation, payment_mode: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAddModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addDonation}
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

export default AllDonations;
