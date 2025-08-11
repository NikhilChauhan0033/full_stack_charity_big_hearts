import React, { useState } from "react";
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

      <div className="flex flex-col xl:flex-row gap-x-10 justify-between py-16 px-3 sm:px-10 md:px-16 xl:px-5">
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
    <p className="text-gray-600">92 Bowery St., New York, NY 10013, USA</p>
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

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        ></textarea>

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Send Message
        </button>

        {success && (
          <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
        )}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d96768.73916078222!2d-73.995703!3d40.717508!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259881d0001cb%3A0x1eb768a2385d175!2s92%20Bowery%2C%20New%20York%2C%20NY%2010013!5e0!3m2!1sen!2sus!4v1754907088432!5m2!1sen!2sus" width="100%" height="450"  loading="lazy" ></iframe>
    </>
  );
};

export default Contact;
