import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader"; // 👈 import loader

const DonationDetail = ({ updateCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [campaign, setCampaign] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 loader state

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true); // 👈 start loader
        const res = await API.get(`donations/${id}/`);
        setCampaign(res.data);

        if (token) {
          const cartRes = await API.get("cart/");
          const cartItems = cartRes.data.results;
          const exists = cartItems.some(
            (item) => item.campaign.id === Number(id)
          );
          setInCart(exists);
        }
      } catch (err) {
        console.error("Error loading donation detail or cart:", err);
      } finally {
        setLoading(false); // 👈 stop loader
      }
    };

    fetchCampaignDetails();
  }, [id, token]);

  const handleCart = async () => {
    if (!token) {
      alert("Please login to use cart.");
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
        alert("Added to cart!");
      } catch (err) {
        const errorData = err.response?.data;
        if (
          Array.isArray(errorData) &&
          errorData[0] === "Campaign already in cart."
        ) {
          alert("Already in cart. Redirecting...");
          navigate("/cart");
        } else {
          console.error("Error adding to cart:", errorData || err.message);
          alert("Something went wrong");
        }
      }
    }
  };

  // 🔄 Show loader until data is ready
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
      {/* You can add a donation form or Razorpay integration here later */}
    </div>
  );
};

export default DonationDetail;
