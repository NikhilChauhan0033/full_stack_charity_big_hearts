import { useEffect, useState } from "react";
import API from "../base_api/api";
import { FaTrash, FaPlus } from "react-icons/fa";
import ToastMessage from "../toastmessage/ToastMessage";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // Confirm Delete Modal
  const [confirmModal, setConfirmModal] = useState({ open: false, contactId: null });

  // Add Contact Modal
  const [addModal, setAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    message: "",
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

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await API.get("admin/contact/");
      setContacts(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      showToast("Failed to fetch contacts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Confirm Delete
  const confirmDeleteContact = (id) => {
    setConfirmModal({ open: true, contactId: id });
  };

  // Delete Contact
  const deleteContact = async () => {
    const id = confirmModal.contactId;
    if (!id) return;

    try {
      await API.delete(`admin/contact/${id}/delete/`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast("Contact deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete contact:", error);
      showToast("Failed to delete contact", "error");
    } finally {
      setConfirmModal({ open: false, contactId: null });
    }
  };

  // Add Contact (optional)
  const addContact = async () => {
    if (!newContact.name.trim() || !newContact.email.trim() || !newContact.message.trim()) {
      showToast("All fields are required", "error");
      return;
    }

    try {
      const res = await API.post("contact/", newContact);
      setContacts((prev) => [...prev, res.data]);
      showToast("Contact added successfully", "success");
      setNewContact({ name: "", email: "", message: "" });
      setAddModal(false);
    } catch (error) {
      console.error("Failed to add contact:", error);
      showToast("Failed to add contact", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F74F22] mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
       <title>Admin Panel All Users Contacts - BigHearts</title>
      {/* Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <h1 className="text-white text-2xl sm:text-3xl font-bold">User Contacts</h1>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FaPlus /> Add Contact
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="bg-white shadow-md rounded-lg h-full flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div className="bg-[#F74F22] text-white">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm sm:text-base font-semibold">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-5">Message</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="h-96 overflow-y-auto divide-y divide-gray-200">
                {contacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
                    <p className="text-sm sm:text-base">No contacts found</p>
                  </div>
                ) : (
                  contacts.map((c) => (
                    <div
                      key={c.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-red-50 transition text-sm sm:text-base break-words"
                    >
                      <div className="col-span-3">{c.name}</div>
                      <div className="col-span-3">{c.email}</div>
                      <div className="col-span-5">{c.message}</div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => confirmDeleteContact(c.id)}
                          className="text-[#F74F22] hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                          title="Delete Contact"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={deleteContact}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmModal({ open: false, contactId: null })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Contact</h2>
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <textarea
              placeholder="Message"
              value={newContact.message}
              onChange={(e) => setNewContact({ ...newContact, message: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAddModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addContact}
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

export default Contacts;
