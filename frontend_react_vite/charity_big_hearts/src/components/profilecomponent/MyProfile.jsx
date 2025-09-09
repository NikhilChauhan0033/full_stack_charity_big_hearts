import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import ToastMessage from "../toastmessage/ToastMessage";
import { FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Header_Repeat from "../header_repeat_component/Header_Repeat"
import bgImage from "../../../src/assets/pagetitle_about-us.jpg";

const MyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [profile, setProfile] = useState({ first_name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("profile/");
      setProfile(res.data);
      setFormData({
        first_name: res.data.first_name,
        email: res.data.email,
      });
    } catch {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateAll = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      // update profile
      const res = await API.put("profile/", {
        first_name: formData.first_name,
        email: formData.email,
      });
      setProfile(res.data);

      // update password if filled
      if (
        passwordData.old_password ||
        passwordData.new_password ||
        passwordData.confirm_password
      ) {
        if (passwordData.new_password !== passwordData.confirm_password) {
          showToast("Passwords do not match", "error");
          return;
        }
        await API.put("profile/change-password/", {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        });
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      }

      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    showToast("Logged out", "success");
    setTimeout(() => navigate("/"), 1000);
  };

  if (loading) return <FullPageLoader />;

  // Reusable MUI field styles
const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "black" },
    "&:hover fieldset": { borderColor: "#F74F22" },
    "&.Mui-focused fieldset": { borderColor: "#F74F22" },

    // 🔹 Input text color (normal)
    "& input": { color: "black" },

    // 🔹 Disabled input styles
    "&.Mui-disabled": {
      "& input.Mui-disabled": {
        WebkitTextFillColor: "#4B5563", // dark gray (Tailwind's gray-600)
        color: "#4B5563",
      },
      "& fieldset": {
        borderColor: "#9CA3AF", // medium gray border instead of light gray
      },
      backgroundColor: "#F3F4F9", // subtle gray bg
    },
  },
};

const labelStyles = {
  color: "black",
  "&.Mui-focused": { color: "#F74F22" },
  "&.Mui-disabled": { color: "#4B5563" }, // dark gray label when disabled
};


  return (
    <>
    <Header_Repeat bgImage={bgImage} Title="My Profile" smallTitle="my profile" />
      <div className="min-h-screen flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-8">
          <div className="flex justify-center items-center text-[#F74F22] text-6xl mb-4">
            <CgProfile />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            My Profile
          </h1>

          <form onSubmit={handleUpdateAll} className="space-y-5">
            {/* Name */}
            <TextField
              fullWidth
              label="Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              InputLabelProps={{ sx: labelStyles }}
              sx={fieldStyles}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              InputLabelProps={{ sx: labelStyles }}
              sx={fieldStyles}
            />

            {/* Password Placeholder (always disabled) */}
            <TextField
              fullWidth
              label="Password"
              value="********"
              disabled
              InputLabelProps={{ sx: labelStyles }}
              sx={fieldStyles}
            />

            {/* Password Fields - only in editing mode */}
            {isEditing &&
              ["old_password", "new_password", "confirm_password"].map(
                (field) => (
                  <TextField
                    key={field}
                    fullWidth
                    label={
                      field === "old_password"
                        ? "Current Password"
                        : field === "new_password"
                        ? "New Password"
                        : "Confirm Password"
                    }
                    name={field}
                    type={
                      showPassword[
                        field === "old_password"
                          ? "old"
                          : field === "new_password"
                          ? "new"
                          : "confirm"
                      ]
                        ? "text"
                        : "password"
                    }
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    InputLabelProps={{ sx: labelStyles }}
                    sx={fieldStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                [field === "old_password"
                                  ? "old"
                                  : field === "new_password"
                                  ? "new"
                                  : "confirm"]:
                                  !showPassword[
                                    field === "old_password"
                                      ? "old"
                                      : field === "new_password"
                                      ? "new"
                                      : "confirm"
                                  ],
                              })
                            }
                            edge="end"
                          >
                            {showPassword[
                              field === "old_password"
                                ? "old"
                                : field === "new_password"
                                ? "new"
                                : "confirm"
                            ] ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )
              )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className={`flex-1 text-white px-6 py-3 rounded-lg text-sm sm:text-base
                  ${
                    isEditing
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-[#FFAC00] hover:bg-[#ffaa00ce]"
                  }`}
              >
                {isEditing ? "Save Changes" : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 bg-[#F74F22] text-white px-6 py-3 rounded-lg hover:bg-[#d84315] text-sm sm:text-base flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastMessage message={toast.message} type={toast.type} />
    </>
  );
};

export default MyProfile;
