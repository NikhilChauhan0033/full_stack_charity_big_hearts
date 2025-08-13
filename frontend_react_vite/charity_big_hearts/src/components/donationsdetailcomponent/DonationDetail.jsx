import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import ToastMessage from "../toastmessage/ToastMessage";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_donation.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import Button from "../buttoncomponent/Button";
import { FaArrowRight } from "react-icons/fa";
import bgHeart from "../../../src/assets/about-us_02.jpg";

const DonationDetail = ({ updateCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [campaign, setCampaign] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [campaignRes, catRes] = await Promise.all([
          API.get(`donations/${id}/`),
          API.get("categories/"),
        ]);

        setCampaign(campaignRes.data);

        if (Array.isArray(catRes.data.results)) {
          setCategories(catRes.data.results);
        }

        if (token) {
          const cartRes = await API.get("cart/");
          const exists = cartRes.data.results?.some(
            (item) => item.campaign.id === Number(id)
          );
          setInCart(Boolean(exists));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleCart = async () => {
    if (!token) {
      setToastMessage("Please login to use cart.");
      setToastType("error");
      navigate("/login");
      return;
    }

    if (inCart) {
      navigate("/cart");
      return;
    }

    try {
      await API.post("cart/", { campaign: Number(id) });
      setInCart(true);
      updateCartCount?.();
      setToastMessage("Added to cart!");
      setToastType("success");
    } catch (err) {
      const errorData = err.response?.data;
      if (
        Array.isArray(errorData) &&
        errorData[0] === "Campaign already in cart."
      ) {
        setToastMessage("Already in cart. Redirecting...");
        setToastType("error");
        navigate("/cart");
      } else {
        console.error("Error adding to cart:", errorData || err.message);
        setToastMessage("Something went wrong");
        setToastType("error");
      }
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/donations/category/${categoryId}`);
  };

  // Prevent crash if data is missing
  const percentage =
    campaign?.goal_amount && campaign?.raised_amount
      ? Math.floor(
          (parseFloat(campaign.raised_amount) /
            parseFloat(campaign.goal_amount)) *
            100
        )
      : 0;

  const categoryName =
    categories.find((cat) => cat.id === campaign?.category)?.name || "Unknown";

  const presetAmounts = [100, 500, 999, 1499, 2111];
  const [amount, setAmount] = useState(presetAmounts[0]); // Default: 100
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Auto-focus input when CUSTOM AMOUNT is active
  useEffect(() => {
    if (activeIndex === presetAmounts.length) {
      inputRef.current?.focus();
    }
  }, [activeIndex]);

  if (loading) return <FullPageLoader />;

  return (
    <>
      <title>Donation Detail - BigHearts</title>
      <Header_Repeat
        bgImage={bgImage}
        secondlocate="/donations"
        Title="donation"
        smallTitle="donation"
        currentPage={campaign?.title || ""}
      />

      <div className="flex xl:flex-row flex-col justify-between items-start gap-x-5 px-3 py-10 sm:p-10 md:p-20">
        {/* Left Section */}
        <div className="w-full xl:w-[73%] rounded-xl mb-10">
          <div className="sm:relative z-0">
            <img
              src={campaign?.image}
              alt={campaign?.title}
              className="w-full rounded-xl"
            />

            {/* Category Badge */}
            <div className="absolute top-8 left-8 text-white bg-[#ffac00] px-3 py-1 text-[12px] rounded-full uppercase font-semibold">
              {categoryName.toUpperCase()}
            </div>
          </div>

          {/* Info Card */}
          <div className="sm:relative sm:mt-[-150px] w-full sm:w-[90%] px-3 py-5 sm:p-10 rounded-xl bg-white shadow-lg z-50 sm:mx-auto">
            {/* Add Cart Button */}
            <button
              onClick={handleCart}
              className="bg-[#F74F22] hover:bg-[#d84315] text-white w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] rounded-full transition flex items-center justify-center float-right"
            >
              {inCart ? (
                <BsFillCartCheckFill className="text-[18px] sm:text-[22px]" />
              ) : (
                <FaShoppingCart className="text-[18px] sm:text-[22px]" />
              )}
            </button>

            <h2 className="text-[30px] font-semibold mb-5">
              {campaign?.title}
            </h2>
            {/* Progress Bar */}
            <div className="mb-5 mt-7">
              <div className="relative h-2 bg-[#FFE9C3] rounded-full mt-10">
                <div
                  className="absolute top-0 left-0 h-2 bg-[#f74f22] rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f74f22] rounded-full z-10"
                  style={{ left: `calc(${percentage}% - 8px)` }}
                />
                <div
                  className="absolute -top-6 text-sm font-bold text-black"
                  style={{ left: `calc(${percentage}% - 12px)` }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
            <p className="text-[17px] font-semibold">
              <span className="text-[#f74f22]">₹{campaign?.raised_amount}</span>{" "}
              of{" "}
              <span className="text-[#ffac00]">₹{campaign?.goal_amount}</span>{" "}
              raised
            </p>

            <hr className="my-5 border-[1px] border-gray-300" />

            {/* Input with Rupee Icon */}
            <div className="flex items-center bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] p-2 w-[200px]">
              <FaRupeeSign className="flex-shrink-0 text-white bg-[#ffac00] w-[37px] h-[37px] rounded-full p-2" />
              <input
                ref={inputRef}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="ml-3 text-[20px] font-semibold w-full outline-none rounded-full placeholder-gray-400"
              />
            </div>

            {/* Preset Amount Buttons */}
            <div className="flex items-center my-5 flex-wrap">
              {presetAmounts.map((amt, index) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt);
                    setActiveIndex(index);
                  }}
                  className={`px-4 py-1 mr-4 mb-2 font-semibold text-[14px] border-[1px] border-gray-400 rounded-full transition 
              ${
                activeIndex === index
                  ? "bg-[#f74f22] text-white border-[#f74f22]"
                  : "hover:text-[#ffac00]"
              }`}
                >
                  ₹{amt}
                </button>
              ))}

              {/* Custom Amount Button */}
              <button
                onClick={() => {
                  setAmount("");
                  setActiveIndex(presetAmounts.length); // Last index = custom
                }}
                className={`px-4 py-1 mr-4 mb-2 font-semibold text-[14px] border-[1px] border-gray-400 rounded-full transition 
            ${
              activeIndex === presetAmounts.length
                ? "bg-[#f74f22] text-white border-[#f74f22]"
                : "hover:text-[#ffac00]"
            }`}
              >
                CUSTOM AMOUNT
              </button>
            </div>

            <hr className="my-5 border-[1px] border-gray-300" />

            <form className="space-y-4">
              <p className="font-semibold text-lg mb-4">Personal Info</p>

              {/* First + Last Name Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* First Name */}
                <div className="w-full lg:w-1/2">
                  <label htmlFor="firstname" className="block mb-1">
                    First Name <span className="text-[#f74f22]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First Name"
                    required
                    className="w-full py-3 px-5 border border-gray-400 rounded-full outline-none"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full lg:w-1/2">
                  <label htmlFor="lastname" className="block mb-1">
                    Last Name <span className="text-[#f74f22]">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last Name"
                    required
                    className="w-full py-3 px-5 border border-gray-400 rounded-full outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="w-full">
                <label htmlFor="email" className="block mb-1">
                  Email Address <span className="text-[#f74f22]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  required
                  className="w-full py-3 px-5 border border-gray-400 rounded-full outline-none"
                />
              </div>
            </form>

            <div className="sm:flex items-center justify-between mt-7">
              <Button
                onClick={null}
                className="group flex items-center bg-[#F74F22] px-8 rounded-full py-4 text-[15px] font-semibold text-white hover:bg-[#FFAC00] mb-5"
                text="DONATE NOW"
                icon={null}
              />
              <p className="text-[20px] font-semibold">
                Donation Total:{" "}
                <span className="text-[#F74F22]">₹{amount}</span>
              </p>
            </div>
          </div>

          <ToastMessage message={toastMessage} type={toastType} />
        </div>

        {/* Right Section */}
        <div className="w-full xl:w-[25%] rounded-xl p-4 pt-0">
          <h3 className="text-2xl font-semibold mb-2">Categories</h3>

          <div className="flex justify-between items-center">
            <hr className="my-5 border-[2px] w-[85%] border-gray-300 rounded-full" />
            <hr className="my-5 border-[2px] w-[13%] border-[#ffac00] rounded-full" />
          </div>

          {categories.length === 0 ? (
            <p className="text-gray-600">No categories found.</p>
          ) : (
            <div>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group w-full flex items-center text-gray-500 font-semibold mb-4 uppercase overflow-hidden transition-all duration-300 ease-in-out hover:text-[#F74F22] text-[15px]"
                >
                  {/* Arrow with animation */}
                  <span className="transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-red-500">
                    <FaArrowRight />
                  </span>
                  {/* Category name */}
                  <span className="transition-all duration-300 ease-in-out group-hover:translate-x-4">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-2">Gallery</h3>

            <div className="flex justify-between items-center">
              <hr className="my-5 border-[2px] w-[85%] border-gray-300 rounded-full" />
              <hr className="my-5 border-[2px] w-[13%] border-[#ffac00] rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <img
                src="../../../src/assets/donation-gallery/widgets_gallery_1-240x240.jpg"
                className="rounded-xl"
                alt=""
              />
              <img
                src="../../../src/assets/donation-gallery/widgets_gallery_2-240x240.jpg"
                className="rounded-xl"
                alt=""
              />
              <img
                src="../../../src/assets/donation-gallery/widgets_gallery_3-240x240.jpg"
                className="rounded-xl"
                alt=""
              />
              <img
                src="../../../src/assets/donation-gallery/widgets_gallery_4-240x240.jpg"
                className="rounded-xl"
                alt=""
              />
              <img
                src="../../../src/assets/donation-gallery/widgets_gallery_5-240x240.jpg"
                className="rounded-xl"
                alt=""
              />
              <img
                src="../../../src/assets/donation-gallery/widgets_gallery_6-240x240.jpg"
                className="rounded-xl"
                alt=""
              />
            </div>
          </div>
          <div
            className="bg-cover bg-center w-full h-fit p-10 mt-10 rounded-xl"
            style={{ backgroundImage: `url(${bgHeart})` }}
          >
            <img
              src="../../../src/assets/logo2.png"
              alt=""
              className="mx-auto"
            />
            <p className="capitalize text-center text-white my-5 text-[30px] font-semibold">
              make kids happy
            </p>
            <Button
              onClick={null}
              className="group flex items-center border-2 border-[#FFAC00] px-8 rounded-full py-4 text-[15px] font-semibold text-white hover:bg-[#FFAC00] mx-auto"
              text="DONATE NOW"
              icon={null}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationDetail;
