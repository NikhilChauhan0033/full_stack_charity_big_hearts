import { useEffect, useState } from "react";
import API from "../base_api/api";
import ToastMessage from "../toastmessage/ToastMessage";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_about-us.jpg";
import Button from "../buttoncomponent/Button";
import { Link } from "react-router-dom";
import { IoCartSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import FullPageLoader from "../loader/FullPageLoader";
import DonationForm from "../donationsdetailcomponent/DonationForm";
import { useNavigate } from "react-router-dom";

const CartPage = ({ updateCartCount }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const navigate = useNavigate();

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
      showToast("Removed from cart!", "success");
    } catch (error) {
      console.error("Failed to remove item:", error);
      showToast("Failed to remove item.", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.donation_amount || 0),
    0
  );

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <title>Cart - BigHearts</title>
      <Header_Repeat bgImage={bgImage} Title="Cart" smallTitle="Cart" />

      <div className="px-3 py-8 md:px-5 xl:p-10">
        {cart.length === 0 ? (
          <>
            <p className="bg-[#F74F22] text-white p-5 rounded-xl w-full font-semibold flex items-center">
              <IoCartSharp className="text-[20px] mr-2" /> No campaign in cart.
            </p>
            <Link to="/donations">
              <Button
                onClick={null}
                className="group flex items-center bg-[#FFAC00] px-6 rounded-2xl mt-5 py-4 text-[15px] font-semibold text-white hover:bg-[#F74F22]"
                text="DONATE NOW"
                icon={null}
              />
            </Link>
          </>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            {/* Table for md and larger */}
            {/* Table for md and larger */}
            <table className="hidden md:table min-w-full bg-white">
              <thead className="bg-[#F74F22] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Image</th>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Your Donation</th>
                  {/* ✅ Added */}
                  <th className="px-6 py-3 text-left">Goal</th>
                  <th className="px-6 py-3 text-left">Raised</th>
                  <th className="px-6 py-3 text-left">To Go</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-6 py-4">
                      <img
                        src={item.campaign.image}
                        alt={item.campaign.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 xl:text-[17px] font-semibold">
                      {item.campaign.title}
                    </td>
                    {/* ✅ Show user's selected donation amount */}
                    <td className="px-6 py-4 font-semibold text-[#F74F22]">
                      ₹{Number(item.donation_amount || 0)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₹{item.campaign.goal_amount}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₹{item.campaign.raised_amount}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₹{item.campaign.to_go}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-[#F74F22] hover:text-[#ffac00]"
                        onClick={() => handleRemove(item.id)}
                      >
                        <ImCross className="text-[15px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card view for mobile */}
            {/* Card view for mobile */}
            <div className="space-y-5 md:hidden">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-[5px] border-t-[1px] border-x-[1px] border-[#F74F22]"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.campaign.image}
                      alt={item.campaign.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-lg">
                        {item.campaign.title}
                      </p>
                      {/* ✅ Added Your Donation */}
                      <p className="text-sm text-[#F74F22] font-medium">
                        Your Donation: ₹{Number(item.donation_amount || 0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Goal: ₹{item.campaign.goal_amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        Raised: ₹{item.campaign.raised_amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        To Go: ₹{item.campaign.to_go}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <button
                      className="text-[#F74F22] hover:text-[#ffac00]"
                      onClick={() => handleRemove(item.id)}
                    >
                      <ImCross className="text-[18px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Total Summary */}
      {cart.length > 0 && (
        <div className="px-3 py-8 md:px-5 xl:p-10">
          <div className="bg-white border border-b-[5px] border-t-[1px] border-x-[1px] border-[#F74F22] rounded-xl p-5 sm:p-10 w-full md:w-[80%]">
            <p className="text-[30px] font-semibold mb-5">Cart Total</p>

            {/* Individual item prices */}
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-x-5 text-[15px] sm:text-[16px]"
                >
                  <span>{item.campaign.title}</span>
                  <span className="text-[#F74F22] font-medium">
                    ₹{Number(item.donation_amount || 0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <hr className="my-4 border-gray-300" />

            {/* Total */}
            <p className="text-[18px] font-semibold flex justify-between mb-5">
              <span>Total:</span>
              <span className="text-[#F74F22]">₹{totalAmount}</span>
            </p>

            {/* ✅ Use DonationForm instead of checkout button */}
            <DonationForm
              amount={totalAmount}
              onSubmit={async (data) => {
                try {
                  // 1️⃣ Post donation for each cart item
                  for (let item of cart) {
                    await API.post("donate/submit/", {
                      campaign: item.campaign.id, // store campaign ID
                      name: data.firstname,
                      surname: data.lastname,
                      email: data.email,
                      donation_amount: Number(item.donation_amount),
                      payment_mode: data.payment_mode,
                    });
                  }

                  // 2️⃣ Remove all items from cart in backend
                  for (let item of cart) {
                    await API.delete(`cart/${item.id}/`);
                  }

                  // 3️⃣ Clear local cart state
                  setCart([]);

                  // 4️⃣ Update cart count in header
                  updateCartCount();

                  // 5️⃣ Navigate to success page
                  navigate("/donation-success", {
                    state: { amount: totalAmount },
                  });
                } catch (err) {
                  console.error(err.response?.data || err);
                  navigate("/donation-error", {
                    state: {
                      error: err.response?.data || "Something went wrong",
                    },
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastMessage message={toast.message} type={toast.type} />
    </>
  );
};

export default CartPage;
