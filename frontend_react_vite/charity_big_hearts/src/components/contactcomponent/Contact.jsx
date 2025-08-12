import React, { useState,useEffect } from "react";
import API from "../base_api/api";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_contacts.jpg";
import contactBG from "../../../src/assets/contacts_01.png";
import { IoLocationSharp } from "react-icons/io5";
import { SiMinutemailer } from "react-icons/si";
import { IoCallSharp } from "react-icons/io5";

const Contact = () => {
 const [form, setForm] = useState({
  name: "",
  email: "",
  message: "",
});

const [success, setSuccess] = useState("");
const [error, setError] = useState("");

// Auto-hide success/error after 3 seconds
useEffect(() => {
  if (success || error) {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [success, error]);

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setError("");
  setSuccess("");
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("contact/", form);
    setSuccess("Your message has been sent!");
    setForm({ name: "", email: "", message: "" });
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      "Something went wrong. Please try again.";
    setError(msg);
  }
};

  return (
    <>
      <title>Contact Us - BigHearts</title>
      <Header_Repeat bgImage={bgImage} Title="Contacts" smallTitle="Contacts" />

      <div className="flex flex-col xl:flex-row gap-x-10 justify-between pt-16 px-3 sm:px-10 md:px-16 xl:px-5">
        {/* Text Section */}
        <div className="w-full xl:w-[45%] order-1 xl:order-2 pt-10 xl:pt-28">
          <p
            style={{ fontFamily: '"Amatic SC", cursive' }}
            className="text-[#ffac00] uppercase text-[20px] sm:text-[25px]"
          >
            contact us
          </p>
          <p className="capitalize text-[25px] sm:text-[35px] font-semibold mb-6">
            Get in Touch
          </p>
          <p className="sm:w-[90%] text-[16px] sm:text-[17px] text-gray-500 mb-10">
            Quam elementum pulvinar etiam non quam lacus suspendisse. A
            scelerisque purus semper eget duis at tellus. Lobortis scelerisque
            fermentum dui faucibus in ornare quam viverra orci.
          </p>

          {/* Address */}
          <div className="flex items-center mb-10 group cursor-pointer">
            <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-xl text-[#F74F22] text-[25px] sm:text-[30px] flex items-center justify-center mr-8 sm:mr-10 group-hover:text-[#FFAC00] transition-colors duration-300">
              <IoLocationSharp />
            </div>
            <div>
              <p className="font-semibold text-[20px]">Visit us</p>
              <p className="text-gray-600">
                92 Bowery St., New York, NY 10013, USA
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center mb-10 group cursor-pointer">
            <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-xl text-[#F74F22] text-[25px] sm:text-[30px] flex items-center justify-center mr-8 sm:mr-10 group-hover:text-[#FFAC00] transition-colors duration-300">
              <SiMinutemailer />
            </div>
            <div>
              <p className="font-semibold text-[20px]">Mail us</p>
              <p className="text-gray-600">bighearts.donation@mail.com</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center mb-10 group cursor-pointer">
            <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-xl text-[#F74F22] text-[25px] sm:text-[30px] flex items-center justify-center mr-8 sm:mr-10 group-hover:text-[#FFAC00] transition-colors duration-300">
              <IoCallSharp />
            </div>
            <div>
              <p className="font-semibold text-[20px]">Call us</p>
              <p className="text-gray-600">+1 (880) 555 353 505</p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div
          className="bg-center bg-cover w-full lg:w-[55%] order-2 xl:order-1"
          style={{ backgroundImage: `url(${contactBG})` }}
        >
          <img
            src="../../../src/assets/contacts_02.png"
            alt=""
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="bg-white shadow-2xl w-[90%] md:w-10/12 mx-auto px-5 py-9 md:p-10 rounded-xl">
        <p className="text-[30px] md:text-[35px] font-semibold mb-2">
          Leave a Reply
        </p>
        <p className="text-[14px] text-gray-500 mb-8">
          Your email address will not be published. Required fields are marked *
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:gap-x-6 md:mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name*"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full md:w-1/2 border-[1px] border-gray-400 p-3 px-5 outline-none rounded-full mb-6 md:mb-0 text-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email*"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full md:w-1/2 border-[1px] border-gray-400 p-3 px-5 outline-none rounded-full mb-6 md:mb-0 text-black"
            />
          </div>

          <textarea
            name="message"
            placeholder="Message..."
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border-[1px] border-gray-400 p-3 px-5 outline-none  rounded-3xl mb-6 text-black"
          ></textarea>

          <button
            type="submit"
            className="uppercase bg-[#F74F22] text-white px-8 py-4 text-[15px] font-semibold rounded-full hover:bg-[#ffac00]"
          >
            Send a Message
          </button>
          {success && (
            <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-x-0 opacity-100">
              {success}
            </div>
          )}

          {error && (
            <div className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-x-0 opacity-100">
              {error}
            </div>
          )}
        </form>
      </div>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d96768.73916078222!2d-73.995703!3d40.717508!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259881d0001cb%3A0x1eb768a2385d175!2s92%20Bowery%2C%20New%20York%2C%20NY%2010013!5e0!3m2!1sen!2sus!4v1754907088432!5m2!1sen!2sus"
        width="100%"
        height="450"
        loading="lazy"
      ></iframe>
    </>
  );
};

export default Contact;
