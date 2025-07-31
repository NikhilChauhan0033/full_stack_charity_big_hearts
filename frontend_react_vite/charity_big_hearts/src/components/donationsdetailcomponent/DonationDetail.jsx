import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";

const DonationDetail = ({ updateCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [campaign, setCampaign] = useState(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    // Fetch donation campaign details
    API.get(`donations/${id}/`)
      .then((res) => setCampaign(res.data))
      .catch((err) => console.error("Error fetching campaign:", err));

    // Check if campaign is already in cart
    if (token) {
      API.get("cart/")
        .then((res) => {
          const cartItems = res.data.results; // ✅ Correctly handle paginated response
          const exists = cartItems.some(
            (item) => item.campaign.id === Number(id)
          );
          setInCart(exists);
        })
        .catch((err) => console.error("Error checking cart:", err));
    }
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
        console.log("Sending campaign to cart:", parseInt(id));
        await API.post("cart/", { campaign: Number(id) });
        setInCart(true);
        updateCartCount(); // ✅ call to update count globally
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

  if (!campaign) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
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
      {/* Add your donation form below if needed */}
    </div>
  );
};

export default DonationDetail;
