import { IoCartOutline, IoSearch } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RxCross2 } from "react-icons/rx"; // ❗Cancel icon
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../base_api/api";
import API from "../base_api/api"; // needed for search

const Header = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("access"));
  const username = localStorage.getItem("username");

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [cartCount, setCartCount] = useState(0);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchTerm(""); // clear when toggled
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

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
      setToken(null);
      navigate("/");
    } catch (error) {
      alert("Error during logout");
    }
  };

  useEffect(() => {
    if (token) {
      API.get("cart/").then((res) => {
        const items = res.data.results || res.data;
        setCartCount(items?.length || 0);
      });
    }
  }, [token]);

  return (
    <>
      <div className="hidden xl:flex justify-between items-center p-5 bg-white shadow-sm relative">
        {/* Logo */}
        <div className="w-[60px]">
         <Link to="/">
          <img
            src="../../../src/assets/logo.png"
            alt="Logo Big Hearts"
            className="w-full"
          />
         </Link>
        </div>

        {/* Navigation Links */}
        <div className="ml-[100px]">
          <ul className="flex gap-12 text-[17px] font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-[#F74F22]" : "text-black"
              }
            >
              <li className="hover:text-[#F74F22]">Home</li>
            </NavLink>
            <NavLink
              to="/donations"
              className={({ isActive }) =>
                isActive ? "text-[#F74F22]" : "text-black"
              }
            >
              <li className="hover:text-[#F74F22]">Donations</li>
            </NavLink>
            <NavLink
              to="/team"
              className={({ isActive }) =>
                isActive ? "text-[#F74F22]" : "text-black"
              }
            >
              <li className="hover:text-[#F74F22]">Our Team</li>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-[#F74F22]" : "text-black"
              }
            >
              <li className="hover:text-[#F74F22]">About Us</li>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-[#F74F22]" : "text-black"
              }
            >
              <li className="hover:text-[#F74F22]">Contacts</li>
            </NavLink>
          </ul>
        </div>

        {/* Icons */}
        <div className="flex gap-8 items-center ml-16 mt-2">
          <Link to="/cart">
            <button className="text-[25px] relative">
              <IoCartOutline className="hover:text-[#F74F22]" />
              <span className="bg-[#F74F22] text-white rounded-full px-1 absolute top-[-14px] right-[-8px] w-[20px] text-[15px] ">
                {cartCount}
              </span>
            </button>
          </Link>

          {/* Search Toggle */}
          <button className="text-[25px]" onClick={toggleSearch}>
            {showSearch ? (
              <RxCross2 className="hover:text-[#F74F22] mb-1" />
            ) : (
              <IoSearch className="hover:text-[#F74F22] mb-1" />
            )}
          </button>

          {token && (
            <Link to="/profile">
              <button className="text-[25px]">
                <MdAccountCircle className="hover:text-[#F74F22]" />
              </button>
            </Link>
          )}
        </div>

        {/* Donate Button */}
        <NavLink to="/donations">
          <button className="group flex items-center border-2 border-[#FFAC00] px-8 rounded-full py-3 text-[14px] font-semibold text-black hover:bg-[#F74F22] hover:text-white">
            DONATE NOW
            <FaHeart className="ml-3 text-[#F74F22] group-hover:text-white transition duration-200" />
          </button>
        </NavLink>

        {/* Auth Buttons */}
        {token ? (
          <button
            className="bg-[#F74F22] text-white text-[15px] p-3 rounded-md ml-4 hover:bg-[#d84315]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-[#F74F22] text-white text-[15px] p-3 rounded-md ml-4 hover:bg-[#d84315]">
              Login / Register
            </button>
          </Link>
        )}

        {/* Search Input Box - Absolute Positioned */}
        {showSearch && (
          <div className="absolute right-[200px] top-full mt-2 z-50 w-[350px] bg-white p-7 rounded shadow">
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
      </div>
    </>
  );
};

export default Header;
