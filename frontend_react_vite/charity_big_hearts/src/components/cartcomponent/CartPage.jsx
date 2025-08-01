import { useEffect, useState } from "react";
import API from "../base_api/api";

const CartPage = ({ updateCartCount }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/");
      const data = res.data.results || res.data; // support both paginated and non-paginated
      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      await API.delete(`cart/${id}/`);
      fetchCart();
      updateCartCount(); // update header count
      alert("Removed from cart!");
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item.");
    }
  };

  if (loading) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="p-6">
        <title>Cart - BigHearts</title>

      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>No products in cart.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="border p-4 mb-3 rounded">
            <p className="font-semibold">Campaign Title: {item.campaign.title}</p>
            <img
              src={item.campaign.image}
              alt={item.campaign.title}
              className="w-64 h-auto my-2"
            />
            <p>Goal: ₹{item.campaign.goal_amount}</p>
            <p>Raised: ₹{item.campaign.raised_amount}</p>
            <p>To Go: ₹{item.campaign.to_go}</p>

            <button
              className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600"
              onClick={() => handleRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
