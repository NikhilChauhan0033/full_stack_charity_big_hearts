import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { SiMinutemailer } from "react-icons/si";
import {Link} from "react-router-dom"

const Footer = () => {
  const handleDonate = () => {
    if (!token) {
      alert("Please login to donate.");
      navigate("/login");
    } else {
      navigate("/donations");
    }
  };
  return (
    <>
      <div className="bg-[#222328] text-white sm:p-16 sm:pb-10 px-5 pt-16 ">
        <div className="flex justify-between items-start flex-wrap">
          <div className="w-[100%] sm:w-[50%] xl:w-[22%] mb-10">
           <Link to="/">
            <img
              src="../../../src/assets/logo1.png"
              alt="logo big hearts"
              className="w-[60px] mb-7"
            />
           </Link>
            <p className="mb-7 w-[90%]">
              We’re curious, passionate, and committed to helping nonprofits
              learn and grow. Donate now!
            </p>
            <button
              onClick={handleDonate}
              className="group flex items-center border-2 border-[#FFAC00] px-8 rounded-full py-3 text-[14px] font-semibold text-black hover:bg-[#F74F22] hover:text-white"
            >
              DONATE NOW
              <FaHeart className="ml-3 text-[#F74F22] group-hover:text-white transition duration-200" />
            </button>
          </div>
          <div className="w-[100%] sm:w-[50%] xl:w-[22%] mb-10">
            <p className="mb-7 text-[20px] font-semibold">Contacts</p>
            <p className="flex items-center mb-5 group">
              <FaLocationDot className="text-[#F74F22] text-[19px] mr-1 group-hover:text-[#f7bb22] transition duration-500 ease-in-out" />
              92 Bowery St., NY 10013
            </p>

            <p className="flex items-center mb-5 group">
              <SiMinutemailer className="text-[#F74F22] text-[19px] mr-1 group-hover:text-[#f7bb22] transition duration-500 ease-in-out" />
              bighearts@mail.com
            </p>
            <p className="flex items-center mb-5 group">
              <IoCall className="text-[#F74F22] text-[19px] mr-1 group-hover:text-[#f7bb22] transition duration-500 ease-in-out" />
              +1 800 123 456 789
            </p>
            <div className="flex items-center">
              <div className="mx-1 w-8 h-8 text flex items-center justify-center rounded-full hover:bg-[#1DA1F2] transition duration-500 ease-in-out border-[1px] border-[#636363] text-[14px] hover:border-[#1DA1F2]">
                {" "}
                <FaTwitter />{" "}
              </div>
              <div className="mx-1 w-8 h-8 text flex items-center justify-center rounded-full hover:bg-[#316FF6] transition duration-500 ease-in-out border-[1px] border-[#636363] text-[14px] hover:border-[#316FF6]">
                {" "}
                <FaFacebookF />{" "}
              </div>
              <div className="mx-1 w-8 h-8 text flex items-center justify-center rounded-full hover:bg-[#E60023] transition duration-500 ease-in-out border-[1px] border-[#636363] text-[14px] hover:border-[#E60023]">
                {" "}
                <FaPinterestP />{" "}
              </div>
              <div className="mx-1 w-8 h-8 text flex items-center justify-center rounded-full hover:bg-[#962fbf] transition duration-500 ease-in-out border-[1px] border-[#636363] text-[14px] hover:border-[#962fbf]">
                {" "}
                <FaInstagram />{" "}
              </div>
            </div>
          </div>
          <div className="w-[100%] sm:w-[50%] xl:w-[22%] mb-10">
            <p className="mb-7 text-[20px] font-semibold">Nonprofits</p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Nonprofit Resources
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Corporate Giving Resources
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Corporate Gift Cards
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              CSR Made Simple
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Start an Application
            </p>
          </div>
          <div className="w-[100%] sm:w-[50%] xl:w-[22%] mb-10">
            <p className="mb-7 text-[20px] font-semibold">Donors</p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Give or Redeem Gift Cards
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Donate in Honor
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Project of the Month Club
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Start a Fundraiser
            </p>
            <p className="mb-3 text-[#cacaca] hover:text-[#F74F22]">
              Donor Resources
            </p>
          </div>
        </div>

        <hr className="sm:mt-16 mb-6 text-[#000000]" />

        <div className="block justify-between sm:flex flex-wrap">
          <p className="mb-5">
            Terms of use{" "}
            <span className="text-[#cacaca] text-[12px] mx-2"> |</span> Privacy
            Environmental Policy
          </p>
          <p>
            Copyright © 2024 BigHearts by{" "}
            <span className="text-[#F74F22]">Nikhil Chauhan</span>. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
