import { useEffect, useState } from "react";
import API from "../base_api/api";
import { FaTrash, FaUsers } from "react-icons/fa";
import ToastMessage from "../toastmessage/ToastMessage";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null });

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

  // Show toast helper
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("admin/users/");
      setUsers(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (id) => {
    setConfirmModal({ open: true, userId: id });
  };

  const deleteUser = async () => {
    const id = confirmModal.userId;
    if (!id) return;

    try {
      await API.delete(`admin/users/${id}/delete/`);
      const deletedUser = users.find((u) => u.id === id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`User "${deletedUser?.username}" deleted successfully`, "success");
    } catch (error) {
      console.error("Failed to delete user:", error);
      showToast("Failed to delete user", "error");
    } finally {
      setConfirmModal({ open: false, userId: null });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F74F22] mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <h1 className="text-white text-center text-2xl sm:text-3xl font-bold">
          All Users
        </h1>
      </div>

      {/* Content Area - Scrollable table container */}
      <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="bg-white shadow-md rounded-lg h-full flex flex-col overflow-hidden">
          
          {/* Table Header - Fixed */}
          <div className="flex-shrink-0">
            <div className="bg-[#F74F22] text-white">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-semibold">
                <div className="text-left">Name</div>
                <div className="text-left">Email</div>
                <div className="text-left">Role</div>
                <div className="text-center">Actions</div>
              </div>
            </div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="flex-1 overflow-auto">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                <FaUsers className="text-3xl sm:text-4xl mb-2 opacity-50" />
                <p className="text-sm sm:text-base">No users found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {users.map((u) => (
                  <div 
                    key={u.id} 
                    className="grid grid-cols-4 gap-2 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-red-50 transition-colors text-sm sm:text-base"
                  >
                    {/* Name */}
                    <div className="font-semibold truncate" title={u.username}>
                      {u.username}
                    </div>
                    
                    {/* Email */}
                    <div className="truncate" title={u.email}>
                      {u.email}
                    </div>
                    
                    {/* Role */}
                    <div>
                      <span className="inline-block px-2 py-1 text-xs sm:text-sm font-semibold text-[#F74F22] bg-red-50 rounded truncate">
                        {u.role}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => confirmDeleteUser(u.id)}
                        className="text-[#F74F22] hover:text-red-600 hover:bg-red-50 p-1.5 sm:p-2 rounded transition-all duration-200 flex items-center justify-center"
                        title="Delete User"
                      >
                        <FaTrash size={window.innerWidth < 640 ? 14 : 16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Confirm Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <div className="mb-4">
              <FaTrash className="text-red-500 text-2xl sm:text-3xl mx-auto mb-2" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Confirm Delete</h2>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                onClick={deleteUser}
                className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base order-2 sm:order-1"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmModal({ open: false, userId: null })}
                className="bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold text-sm sm:text-base order-1 sm:order-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;