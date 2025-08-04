import Button from "../buttoncomponent/Button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Third_Home = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("access"));

  const handleDonate = () => {
    if (!token) {
      alert("Please login to donate.");
      navigate("/login");
    } else {
      navigate("/donations");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between items-center gap-10 px-4 py-10 sm:px-24 sm:py-24">
      {/* Left Section */}
<div className="w-full md:w-1/2 relative">
  {/* Background Image - full width */}
  <img
    src="../../../src/assets/images/children_image.png"
    alt=""
    className="w-full h-auto"
  />

  {/* Yellow image + centered text always visible */}
  <div className="absolute bottom-0 left-0 w-full">
    <div className="relative w-full">
      {/* Yellow image */}
      <img
        src="../../../src/assets/images/yellow_img.png"
        alt=""
        className="w-full h-auto"
      />

      {/* Centered text on top of yellow image */}
      <div className="absolute inset-0 flex items-center justify-center px-4 mt-[150px] sm:mt-[220px]">
        <p className="text-[18px] sm:text-[22px] md:text-[24px] xl:text-[30px] text-white font-semibold text-center max-w-[18rem] sm:max-w-[22rem] leading-snug">
          255 300+ Children in Africa Need School
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Right Section */} 
      <div className="w-full xl:w-2/5">
        <p
          className="text-[20px] uppercase text-[#FFAC00] mb-3"
          style={{ fontFamily: '"Amatic SC", cursive' }}
        >
          Safe + Easy Donations
        </p>
        <p className="text-[28px] xl:text-[35px] font-semibold mb-4">
          Helping Today. Helping Tomorrow
        </p>
        <p className="text-[16px] xl:text-[17px] text-gray-500 leading-7 mb-6">
          BigHearts is the largest global crowdfunding community connecting
          nonprofits, donors, and companies in nearly every country. We help
          nonprofits from Afghanistan to Zimbabwe (and hundreds of places in
          between) access the tools, training, and support they need to be more
          effective and make our world a better place.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            onClick={handleDonate}
            className="group flex items-center bg-[#F74F22] px-8 rounded-full py-4 text-[15px] font-semibold text-white hover:bg-[#FFAC00]"
            text="DONATE NOW"
            icon={null}
          />
          <Link to="/team">
            <Button
              onClick={null}
              className="group flex items-center px-8 rounded-full py-4 text-[15px] font-semibold text-[#F74F22] hover:text-[#FFAC00]"
              text="OUR TEAM"
              icon={null}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Third_Home;
