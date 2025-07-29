import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";

const SmallHeaderComponent = () => {
  const getCurrentDate = () => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.toLocaleString("default", { month: "long" }), // like July
      year: now.getFullYear(),
    };
  };

  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getCurrentDate();
      const hasDateChanged = newDate.day !== currentDate.day;

      if (hasDateChanged) {
        setCurrentDate(newDate);
      }
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval); // cleanup
  }, [currentDate]);

  return (
    <>
      <div className="hidden xl:flex justify-between items-center bg-[#222328] text-white text-[14px] font-[400] px-5">
        <div className="flex items-center">
          <div className="text-[30px] mr-2 font-bold text-[#F74F22]">
            {currentDate.day}
          </div>{" "}
          <div className="text-[12px]">
            {currentDate.month} <div>{currentDate.year}</div>
          </div>
        </div>
        <p className="bg-[#ffffff14] px-4 py-1 rounded-full">
          COVID-19 Big Hearts Policy Update{" "}
          <span className="mx-3 text-[#F74F22]">●</span> Calling All Climate
          Champions To Apply
        </p>
        <p className="flex items-center">
            <span className="mr-2 text-[#595959]">●</span>
          <FaLocationDot className="text-[#F74F22] text-[19px] mr-1 hover:text-[#f7bb22] transition duration-500 ease-in-out" />
          92 Bowery St., New York, NY 10013
        </p>
        <p className="flex items-center">
            <span className="mr-2 text-[#595959]">●</span>
          <IoCall className="text-[#F74F22] text-[19px] mr-1 hover:text-[#f7bb22] transition duration-500 ease-in-out" />
          +1 800 123 456 789
        </p>
        <div className="flex justify-between items-center">
            <div className="mx-1 w-6 h-6 text flex items-center justify-center rounded-full hover:bg-[#1DA1F2] transition duration-500 ease-in-out"> <FaTwitter /> </div>
            <div className="mx-1 w-6 h-6 text flex items-center justify-center rounded-full hover:bg-[#316FF6] transition duration-500 ease-in-out"> <FaFacebookF /> </div>
            <div className="mx-1 w-6 h-6 text flex items-center justify-center rounded-full hover:bg-[#E60023] transition duration-500 ease-in-out"> <FaPinterestP /> </div>
            <div className="mx-1 w-6 h-6 text flex items-center justify-center rounded-full hover:bg-[#962fbf] transition duration-500 ease-in-out"> <FaInstagram /> </div>
        </div>
      </div>
    </>
  );
};

export default SmallHeaderComponent;
