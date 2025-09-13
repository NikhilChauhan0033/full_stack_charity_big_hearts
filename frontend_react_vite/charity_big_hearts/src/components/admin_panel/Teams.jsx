import { useEffect, useState } from "react";
import API from "../base_api/api";
import { FaTrash, FaPlus, FaEdit, FaUser, FaEnvelope, FaPhone, FaUserTag, FaClock, FaUsers } from "react-icons/fa";
import ToastMessage from "../toastmessage/ToastMessage";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // Add/Edit Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  // Confirm Delete Modal
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    teamId: null,
  });

  const [newTeam, setNewTeam] = useState({
    name: "",
    role: "",
    small_description: "",
    experience: "",
    email: "",
    phone_no: "",
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

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const res = await API.get("team/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      showToast("Failed to fetch teams", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Add team
  const addTeam = async () => {
    if (!newTeam.name.trim()) {
      showToast("Team name is required", "error");
      return;
    }

    const formData = new FormData();
    Object.entries(newTeam).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await API.post("team/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Team member added successfully!", "success");
      setNewTeam({
        name: "",
        role: "",
        small_description: "",
        experience: "",
        email: "",
        phone_no: "",
        image: null,
      });
      setAddModal(false);
      fetchTeams();
    } catch (error) {
      console.error("Failed to add team member:", error);
      showToast("Failed to add team member", "error");
    }
  };

  // Confirm delete
  const confirmDeleteTeam = (id) => {
    setConfirmModal({ open: true, teamId: id });
  };

  // Delete team
  const deleteTeam = async () => {
    const id = confirmModal.teamId;
    if (!id) return;

    try {
      await API.delete(`team/${id}/`);
      setTeams((prev) => prev.filter((t) => t.id !== id));
      showToast("Team member deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete team member:", error);
      showToast("Failed to delete team member", "error");
    } finally {
      setConfirmModal({ open: false, teamId: null });
    }
  };

  // Update team
  const updateTeam = async () => {
    if (!editModal) return;
    const formData = new FormData();
    Object.entries(editModal).forEach(([key, value]) => {
      if (value instanceof File || typeof value === "string")
        formData.append(key, value);
    });

    try {
      await API.patch(`team/${editModal.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Team member updated successfully!", "success");
      setEditModal(null);
      fetchTeams();
    } catch (error) {
      console.error("Failed to update team member:", error);
      showToast("Failed to update team member", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F74F22] mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">
            Loading team members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <title>Admin Panel All Team Members - BigHearts</title>
      {/* Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Team Members
          </h1>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F74F22] text-white">
              <FaUsers className="mr-2" />
              {teams.length} Members
            </span>
          </div>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition "
        >
          <FaPlus /> Add Team
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {/* Mobile Card Layout */}
        <div className="md:hidden h-full">
          <div className="px-4 pb-4 h-full">
            <div className="h-full overflow-y-auto">
              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FaUsers className="text-5xl mb-4 opacity-50" />
                  <p className="text-lg">No team members found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.map((t) => (
                    <div 
                      key={t.id} 
                      className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Team Member Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <FaUser className="text-gray-400 mr-2 text-sm" />
                            <h3 className="text-lg font-bold text-gray-800">
                              {t.name}
                            </h3>
                          </div>
                          <div className="flex items-center">
                            <FaUserTag className="text-gray-400 mr-2 text-sm" />
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                              {t.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => setEditModal(t)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Team Member"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => confirmDeleteTeam(t.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Team Member"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Team Member Details */}
                      <div className="space-y-3">
                        {/* Email */}
                        <div className="flex items-center text-gray-600">
                          <FaEnvelope className="text-gray-400 mr-3 text-sm flex-shrink-0" />
                          <span className="text-sm truncate" title={t.email}>
                            {t.email}
                          </span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center text-gray-600">
                          <FaPhone className="text-gray-400 mr-3 text-sm flex-shrink-0" />
                          <span className="text-sm">
                            {t.phone_no}
                          </span>
                        </div>

                        {/* Experience */}
                        {t.experience && (
                          <div className="flex items-center text-gray-600">
                            <FaClock className="text-gray-400 mr-3 text-sm flex-shrink-0" />
                            <span className="text-sm">
                              {t.experience} experience
                            </span>
                          </div>
                        )}

                        {/* Description */}
                        {t.small_description && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {t.small_description}
                            </p>
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
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="bg-[#F74F22] text-white">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-1">Experience</div>
                    <div className="col-span-1 text-center">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto">
                  {teams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                      <FaUsers className="text-4xl mb-2 opacity-50" />
                      <p className="text-base">No team members found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {teams.map((t) => (
                        <div
                          key={t.id}
                          className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-red-50 transition text-sm"
                        >
                          <div className="col-span-3 font-semibold">{t.name}</div>
                          <div className="col-span-2">{t.role}</div>
                          <div className="col-span-3">{t.email}</div>
                          <div className="col-span-2">{t.phone_no}</div>
                          <div className="col-span-1">{t.experience}</div>
                          <div className="col-span-1 flex justify-center gap-3">
                            <button
                              onClick={() => setEditModal(t)}
                              className="text-blue-500 hover:text-blue-700 p-2 rounded transition"
                              title="Edit Team Member"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => confirmDeleteTeam(t.id)}
                              className="text-[#F74F22] hover:text-red-600 p-2 rounded transition"
                              title="Delete Team Member"
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

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <FaTrash className="text-red-500 text-3xl mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this team member? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={deleteTeam}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmModal({ open: false, teamId: null })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Team Member
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="text"
              placeholder="Role"
              value={newTeam.role}
              onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="email"
              placeholder="Email"
              value={newTeam.email}
              onChange={(e) =>
                setNewTeam({ ...newTeam, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="text"
              placeholder="Phone No"
              value={newTeam.phone_no}
              onChange={(e) =>
                setNewTeam({ ...newTeam, phone_no: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="text"
              placeholder="Experience"
              value={newTeam.experience}
              onChange={(e) =>
                setNewTeam({ ...newTeam, experience: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <textarea
              placeholder="Small Description"
              value={newTeam.small_description}
              onChange={(e) =>
                setNewTeam({ ...newTeam, small_description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22] min-h-[80px]"
            />
            <input
              type="file"
              onChange={(e) =>
                setNewTeam({ ...newTeam, image: e.target.files[0] })
              }
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
                onClick={addTeam}
                className="bg-[#F74F22] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Team Member
            </h2>
            <input
              type="text"
              value={editModal.name}
              onChange={(e) =>
                setEditModal({ ...editModal, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="text"
              value={editModal.role}
              onChange={(e) =>
                setEditModal({ ...editModal, role: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="email"
              value={editModal.email}
              onChange={(e) =>
                setEditModal({ ...editModal, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="text"
              value={editModal.phone_no}
              onChange={(e) =>
                setEditModal({ ...editModal, phone_no: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <input
              type="text"
              value={editModal.experience}
              onChange={(e) =>
                setEditModal({ ...editModal, experience: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            />
            <textarea
              value={editModal.small_description}
              onChange={(e) =>
                setEditModal({
                  ...editModal,
                  small_description: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#F74F22] min-h-[80px]"
            />
            <input
              type="file"
              onChange={(e) =>
                setEditModal({ ...editModal, image: e.target.files[0] })
              }
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
                onClick={updateTeam}
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

export default Teams;