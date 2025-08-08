import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_about-us.jpg";
import Button from "../buttoncomponent/Button";
import { Link } from "react-router-dom";
import { IoArrowForwardSharp } from "react-icons/io5";
import AboutBG from "../../../src/assets/about-us_02.jpg";
import Fifth_Home from "../fifth_home_component/Fifth_Home";
import fifthBGImage from "../../../src/assets/home-bg2.jpg";

import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import helpBGImage from "../../../src/assets/bg-aboutUs.jpg";

const partnerImages = [
  "partners_01.png",
  "partners_02.png",
  "partners_03.png",
  "partners_04.png",
  "partners_05.png",
  "partners_06.png",
];

const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Run only once when in view
    threshold: 0.3, // Start when 30% is visible
  });

  const stats = [
    { value: 35, label: "YEARS OF FOUNDATION" },
    { value: 60, suffix: "+", label: "MONTHLY DONORS" },
    { value: 15, suffix: "k", label: "INCREDIBLE VOLUNTEERS" },
    { value: 785, label: "SUCCESSFUL CAMPAIGNS" },
  ];
  return (
    <>
      <title>About Us - BigHearts</title>

      <Header_Repeat bgImage={bgImage} Title="about us" smallTitle="about us" />

      <div>
        <div className="flex justify-between items-center px-3 py-16 md:p-20 lg:flex-row flex-col gap-7">
          <div className="w-full xl:w-[45%]">
            <p
              style={{ fontFamily: '"Amatic SC", cursive' }}
              className="text-[#ffac00] uppercase text-[20px] sm:text-[25px]"
            >
              Safe + Easy Donations
            </p>
            <p className="capitalize text-[25px] sm:text-[35px] font-semibold mb-6">
              Helping Today. Helping Tommorow
            </p>
            <p className=" text-[16px] sm:text-[17px] text-gray-500 mb-10">
              Tellus mauris a diam maecenas sed enim ut sem. Viverra accumsn in
              nisl nisi scelerisque eu ultrices vitae. Pellentesque eu tincidunt
              tortor aliquam. Vel elit scelerisque mauris pellentesque pulvinar
              pellentesque habitant morbi. Diam maecenas sed enim ut sem.
              Aliquet enim tortor at auctor urna.
            </p>
            <div className="flex sm:flex-row flex-col items-center">
              <Button
                onClick={null}
                className="group flex items-center bg-[#F74F22] px-8 rounded-full py-4 text-[15px] font-semibold text-white hover:bg-[#FFAC00]"
                text="LEARN MORE"
                icon={null}
              />
              <Link to="/team">
                <Button
                  onClick={null}
                  className="group flex items-center px-8 rounded-full py-4 text-[15px] font-semibold text-[#F74F22] hover:text-black"
                  text="OUR TEAM"
                  icon={<IoArrowForwardSharp />}
                />
              </Link>
            </div>
          </div>
          <div className="w-full xl:w-[55%]">
            <div className="sm:relative mb-10">
              <img
                src="../../../src/assets/about-us_01.jpg"
                alt=""
                className="rounded-2xl mb-10"
              />
              <div
                className="w-full sm:w-1/2 h-fit bg-cover bg-center sm:absolute top-16 right-0 xl:right-22 p-10 rounded-xl text-white"
                style={{ backgroundImage: `url(${AboutBG})` }}
              >
                <p className="text-[20px] mb-5">
                  The best way to not feel hopeless is to get up and do
                  something
                </p>
                <p className=" text-[25px] font-semibold mb-2">Tony Olson</p>
                <p style={{ fontFamily: '"Amatic SC", cursive' }}>VOLUNTEER</p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ backgroundImage: `url(${helpBGImage})` }}
          className="bg-cover bg-center w-full h-fit text-center px-3 py-10 sm:p-12 md:p-14 xl:p-20"
        >
          <p
            style={{ fontFamily: '"Amatic SC", cursive' }}
            className="text-[#ffac00] uppercase text-[20px] sm:text-[25px]"
          >
            Help is Our Goal
          </p>
          <p className="capitalize text-[25px] sm:text-[35px] font-semibold mb-10">
            What Make Us Different
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-transparent rounded-lg hover:bg-white py-10 px-5">
              <img
                src="../../../src/assets/about-us-icons/icon-box_01.png"
                alt=""
                className="mx-auto"
              />
              <p className="my-5 font-semibold text-[22px] ">We Educate</p>
              <p className="text-gray-600">
                We help local nonprofits access the funding, tools, training,
                and support they need
              </p>
            </div>
            <div className="bg-transparent rounded-lg hover:bg-white py-10 px-5">
              <img
                src="../../../src/assets/about-us-icons/icon-box_02.png"
                alt=""
                className="mx-auto"
              />
              <p className="my-5 font-semibold text-[22px] ">We Help</p>
              <p className="text-gray-600">
                We help local nonprofits access the funding, tools, training,
                and support they need
              </p>
            </div>
            <div className="bg-transparent rounded-lg hover:bg-white py-10 px-5">
              <img
                src="../../../src/assets/about-us-icons/icon-box_03.png"
                alt=""
                className="mx-auto"
              />
              <p className="my-5 font-semibold text-[22px] ">We Build</p>
              <p className="text-gray-600">
                We help local nonprofits access the funding, tools, training,
                and support they need
              </p>
            </div>
            <div className="bg-transparent rounded-lg hover:bg-white py-10 px-5">
              <img
                src="../../../src/assets/about-us-icons/icon-box_04.png"
                alt=""
                className="mx-auto"
              />
              <p className="my-5 font-semibold text-[22px] ">We Donate</p>
              <p className="text-gray-600">
                We help local nonprofits access the funding, tools, training,
                and support they need
              </p>
            </div>
          </div>
        </div>
        <div
          className="pb-"
          style={{
            backgroundImage: `url(${helpBGImage})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            backgroundSize: "100% 50%", // only half height
          }}
        >
          <div
            ref={ref}
            className="bg-white shadow-xl rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-10 w-[80%] mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center justify-center sm:justify-start"
              >
                <h2 className="text-[#f74f22] text-[45px] font-semibold mr-3">
                  {inView && (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2}
                      suffix={stat.suffix || ""}
                      separator=","
                    />
                  )}
                </h2>
                <p className="text-black text-[14px] font-semibold w-1/2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      <div className="pt-20">
          <Fifth_Home
          bgImage={fifthBGImage}
          bgColor={null}
          partnerImages={partnerImages}
        />
      </div>
      </div>
    </>
  );
};

export default AboutUs;
