import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import ToastMessage from "../toastmessage/ToastMessage";

const DonationDetail = ({ updateCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [campaign, setCampaign] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]); // ✅ for category filter

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

  // Fetch campaign + cart check + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch campaign detail
        const res = await API.get(`donations/${id}/`);
        setCampaign(res.data);

        // Fetch categories for filter section
        const catRes = await API.get("categories/");
        if (Array.isArray(catRes.data.results)) {
          setCategories(catRes.data.results);
        }

        // Check if campaign already in cart
        if (token) {
          const cartRes = await API.get("cart/");
          const exists = cartRes.data.results.some(
            (item) => item.campaign.id === Number(id)
          );
          setInCart(exists);
        }
      } catch (err) {
        console.error("Error fetching detail/cart/categories:", err);
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
    } else {
      try {
        await API.post("cart/", { campaign: Number(id) });
        setInCart(true);
        updateCartCount();
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
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/donations/category/${categoryId}`);
  };

  if (loading) return <FullPageLoader />;

  return (
    <div style={{ padding: "20px" }}>
      <title>Donation Detail - BigHearts</title>

      <h2>{campaign.title}</h2>
      <img src={campaign.image} alt={campaign.title} width="300" />
      <p>Goal: ₹{campaign.goal_amount}</p>
      <p>Raised: ₹{campaign.raised_amount}</p>
      <p>To Go: ₹{campaign.to_go}</p>

      <button
        onClick={handleCart}
        className="bg-[#F74F22] text-white px-4 py-2 my-4 rounded"
      >
        {inCart ? "Go to Cart" : "Add to Cart"}
      </button>

      <h3>Donate Now</h3>
      {/* Donation form / Razorpay later */}

      <ToastMessage message={toastMessage} type={toastType} />

      {/* ✅ Category Filter Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Filter by Category</h3>
        {categories.length === 0 ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="px-4 py-2 bg-[#ffac00] hover:bg-[#e69500] text-white rounded-full transition"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationDetail;
