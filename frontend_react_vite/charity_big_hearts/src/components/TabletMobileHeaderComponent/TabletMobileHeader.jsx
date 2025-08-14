import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoCartOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import Drawer from "@mui/material/Drawer";
import API from "../base_api/api";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { logout } from "../base_api/api";
import ToastMessage from "../toastmessage/ToastMessage"; // ✅ Import ToastMessage

const TabletMobileHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(""); // ✅ Toast state
  const [toastType, setToastType] = useState(""); // ✅ Toast type
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchTerm("");
  };

  // ✅ Auto-hide toast function
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ✅ Show toast helper function
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleSearch = async () => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return;

    try {
      const catRes = await API.get("categories/");
      const categories = catRes.data.results || catRes.data;

      const matchedCat = categories.find(
        (cat) => cat.name.toLowerCase() === trimmed
      );

      if (matchedCat) {
        navigate(`/donations/category/${matchedCat.id}`);
        return;
      }

      const titleRes = await API.get(`donations/?search=${trimmed}`);
      const matchedCampaign = titleRes.data.results?.find(
        (c) => c.title.toLowerCase() === trimmed
      );

      if (matchedCampaign) {
        navigate(`/donations/detail/${matchedCampaign.id}`);
        return;
      }

      navigate("/donations");
    } catch (err) {
      console.error("Search error:", err);
      navigate("/donations");
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false); // ✅ Auto close drawer
  };

  useEffect(() => {
    if (token) {
      API.get("cart/").then((res) => {
        const items = res.data.results || res.data;
        setCartCount(items?.length || 0);
      });
    }
  }, [token]);

  // ✅ Updated handleLogout with toast
  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully!", "success"); // ✅ Use toast instead of alert
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      navigate("/");
      setDrawerOpen(false);
    } catch (error) {
      showToast("Error during logout. Please try again.", "error"); // ✅ Use toast for error
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[#222328] text-white p-5 relative xl:hidden">
        <button className="text-[25px]" onClick={toggleDrawer(true)}>
          <FaBars className="hover:text-[#F74F22]" />
        </button>

        <div className="w-[75px]">
          <Link to="/">
            <img src="../../../src/assets/logo1.png" alt="Logo Big Hearts" />
          </Link>
        </div>

        <button className="text-[25px]" onClick={toggleSearch}>
          {showSearch ? (
            <RxCross2 className="hover:text-[#F74F22]" />
          ) : (
            <IoSearch className="hover:text-[#F74F22]" />
          )}
        </button>
      </div>

      {/* Absolute Search Input */}
      {showSearch && (
        <div className="absolute right-5 mt-2 z-50 w-[300px] bg-white p-7 rounded shadow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border-2 rounded-full px-4 py-3 pr-12 text-[16px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#F74F22] text-white p-2 rounded-full text-[22px] hover:bg-orange-600 transition duration-200"
            >
              <IoSearch />
            </button>
          </div>
        </div>
      )}

      {/* MUI Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "100vw",
              sm: 380,
            },
            backgroundColor: "#222328",
          },
        }}
      >
        <div className="h-full relative text-white">
          {/* Close Button */}
          <button
            onClick={toggleDrawer(false)}
            className="absolute top-4 right-4 text-[28px] text-white bg-[#F74F22] rounded p-2"
          >
            <RxCross2 />
          </button>

          {/* Logo */}
          <div className="mb-6 mt-12 ml-4">
            <Link to="/" onClick={() => handleNavClick("/")}>
              <img
                src="../../../src/assets/logo1.png"
                alt="Logo"
                className="w-[75px]"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col px-5 text-[17px] font-semibold sm:px-6">
            <li className="border-b-[1px] border-[#868686] py-3">
              <NavLink
                to="/"
                onClick={() => handleNavClick("/")}
                className={({ isActive }) =>
                  isActive ? "text-[#F74F22]" : "text-white"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="border-b-[1px] border-[#868686] py-3">
              <NavLink
                to="/donations"
                onClick={() => handleNavClick("/donations")}
                className={({ isActive }) =>
                  isActive ? "text-[#F74F22]" : "text-white"
                }
              >
                Donations
              </NavLink>
            </li>
            <li className="border-b-[1px] border-[#868686] py-3">
              <NavLink
                to="/team"
                onClick={() => handleNavClick("/team")}
                className={({ isActive }) =>
                  isActive ? "text-[#F74F22]" : "text-white"
                }
              >
                Our Team
              </NavLink>
            </li>
            <li className="border-b-[1px] border-[#868686] py-3">
              <NavLink
                to="/about"
                onClick={() => handleNavClick("/about")}
                className={({ isActive }) =>
                  isActive ? "text-[#F74F22]" : "text-white"
                }
              >
                About Us
              </NavLink>
            </li>
            <li className="border-b-[1px] border-[#868686] py-3">
              <NavLink
                to="/contact"
                onClick={() => handleNavClick("/contact")}
                className={({ isActive }) =>
                  isActive ? "text-[#F74F22]" : "text-white"
                }
              >
                Contacts
              </NavLink>
            </li>
          </ul>

          {/* Cart & Profile Icons */}
          <div className="flex gap-6 items-center px-6 mt-6">
            <div className="relative">
              <button
                onClick={() => handleNavClick("/cart")}
                className="text-[28px]"
              >
                <IoCartOutline className="hover:text-[#F74F22]" />
              </button>

              {token && (
                <span className="absolute -top-2 -right-2 bg-[#F74F22] text-white text-[12px] w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {token && (
              <button
                onClick={() => handleNavClick("/profile")}
                className="text-[28px]"
              >
                <MdAccountCircle className="hover:text-[#F74F22]" />
              </button>
            )}
          </div>
          <div className="mt-8 px-6">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full bg-[#F74F22] text-white text-[16px] font-medium py-3 rounded-md hover:bg-[#d84315]"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  handleNavClick("/login");
                }}
                className="w-full bg-[#F74F22] text-white text-[16px] font-medium py-3 rounded-md hover:bg-[#d84315]"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </Drawer>

      {/* ✅ Toast Notification */}
      <ToastMessage message={toastMessage} type={toastType} />
    </>
  );
};

export default TabletMobileHeader;