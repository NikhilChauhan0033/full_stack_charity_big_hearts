import Button from "../buttoncomponent/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ToastMessage from "../toastmessage/ToastMessage"; // ✅ Import ToastMessage

const Home_Category_Second = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("access"));

  const [toastMessage, setToastMessage] = useState(""); // ✅ Toast state
  const [toastType, setToastType] = useState(""); // ✅ Toast type

  // ✅ Show toast helper function
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleDonate = () => {
    if (!token) {
      showToast("Please login to donate.", "error"); // ✅ Use toast instead of alert
      navigate("/login");
    } else {
      navigate("/donations");
    }
  };

  return (
    <>
      <div className=" xl:flex justify-between bg-[url(../../../src/assets/home-bg2.jpg)] px-4 py-24 sm:p-24 flex-wrap">
        <div className="w-[100%] xl:w-[30%] mb-14">
          <p className="text-[30px] font-semibold mb-8">
            Connects Nonprofits, Donors, & Companies in Every Country
          </p>
          <Button
            onClick={handleDonate}
            className="group flex items-center border-2 border-[#FFAC00] px-8 rounded-full py-4 text-[15px] font-semibold text-black hover:bg-[#FFAC00] hover:text-white"
            text="DONATE NOW"
            icon={null}
          />
        </div>
        <div className="w-[100%] xl:w-[65%] md:grid grid-cols-2 grid-rows-2 gap-8">
          <div className="flex justify-between mb-10">
            <div className="w-[500px] sm:w-[300px]">
              <img src="../../../src/assets/icons/food_icon.png" alt="" />
            </div>
            <div>
              <p className="text-[20px] font-semibold mb-4">Healthy Food</p>
              <p className="text-gray-500">
                We help local nonprofits access the funding, tools, training,
                and support they need to become more.
              </p>
            </div>
          </div>
          <div className="flex justify-between mb-10">
            <div className="w-[500px] sm:w-[300px]">
              <img src="../../../src/assets/icons/water_icon.png" alt="" />
            </div>
            <div>
              <p className="text-[20px] font-semibold mb-4">Clean Water</p>
              <p className="text-gray-500">
                We help local nonprofits access the funding, tools, training,
                and support they need to become more.
              </p>
            </div>
          </div>
          <div className="flex justify-between mb-10">
            <div className="w-[500px] sm:w-[300px]">
              <img src="../../../src/assets/icons/medician_icon.png" alt="" />
            </div>
            <div>
              <p className="text-[20px] font-semibold mb-4">Medical Help</p>
              <p className="text-gray-500">
                We help local nonprofits access the funding, tools, training,
                and support they need to become more.
              </p>
            </div>
          </div>
          <div className="flex justify-between mb-10">
            <div className="w-[500px] sm:w-[300px]">
              <img src="../../../src/assets/icons/education_icon.png" alt="" />
            </div>
            <div>
              <p className="text-[20px] font-semibold mb-4">Education</p>
              <p className="text-gray-500">
                We help local nonprofits access the funding, tools, training,
                and support they need to become more.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ Toast Notification */}
      <ToastMessage message={toastMessage} type={toastType} />
    </>
  );
};

export default Home_Category_Second;
