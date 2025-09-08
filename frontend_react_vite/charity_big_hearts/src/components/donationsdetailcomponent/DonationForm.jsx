// src/components/donations/DonationForm.jsx
import { useState, useRef, useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import Button from "../buttoncomponent/Button";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

const DonationForm = ({ campaignId, defaultAmount = 100, onSubmit }) => {
  const presetAmounts = [100, 500, 999, 1499, 2111];
  const [amount, setAmount] = useState(defaultAmount);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "" });
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const inputRef = useRef(null);

  // auto focus custom input
  useEffect(() => {
    if (activeIndex === presetAmounts.length) inputRef.current?.focus();
  }, [activeIndex]);

  // amount change
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);

    const presetIndex = presetAmounts.findIndex((amt) => amt.toString() === newAmount);
    setActiveIndex(presetIndex !== -1 ? presetIndex : presetAmounts.length);
  };

  // input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        campaignId,
        amount: parseFloat(amount),
        ...formData,
        payment_mode: selectedPayment,
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Amount input */}
      <div className="flex items-center bg-white rounded-full shadow p-2 w-[200px]">
        <FaRupeeSign className="flex-shrink-0 text-white bg-[#ffac00] w-[37px] h-[37px] rounded-full p-2" />
        <input
          ref={inputRef}
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="ml-3 text-[20px] font-semibold w-full outline-none rounded-full"
          min="10"
          max="1000000"
        />
      </div>

      {/* Preset buttons */}
      <div className="flex items-center my-5 flex-wrap">
        {presetAmounts.map((amt, index) => (
          <button
            type="button"
            key={amt}
            onClick={() => {
              setAmount(amt);
              setActiveIndex(index);
            }}
            className={`px-4 py-1 mr-4 mb-2 font-semibold text-[14px] border rounded-full 
              ${activeIndex === index ? "bg-[#f74f22] text-white border-[#f74f22]" : "hover:text-[#ffac00]"}`}
          >
            ₹{amt}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setAmount("");
            setActiveIndex(presetAmounts.length);
          }}
          className={`px-4 py-1 mr-4 mb-2 font-semibold text-[14px] border rounded-full 
            ${activeIndex === presetAmounts.length ? "bg-[#f74f22] text-white border-[#f74f22]" : "hover:text-[#ffac00]"}`}
        >
          CUSTOM AMOUNT
        </button>
      </div>

      {/* Personal Info */}
      <p className="font-semibold text-lg mb-4">Personal Info</p>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/2">
          <label htmlFor="firstname" className="block mb-1">
            First Name <span className="text-[#f74f22]">*</span>
          </label>
          <input
            required
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full py-3 px-5 border rounded-full"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <label htmlFor="lastname" className="block mb-1">
            Last Name <span className="text-[#f74f22]">*</span>
          </label>
          <input
            required
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full py-3 px-5 border rounded-full"
          />
        </div>
      </div>

      <div className="w-full">
        <label htmlFor="email" className="block mb-1">
          Email <span className="text-[#f74f22]">*</span>
        </label>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email Address"
          className="w-full py-3 px-5 border rounded-full"
        />
      </div>

      {/* Payment Method */}
      <FormControl component="fieldset" className="w-full mt-6">
        <FormLabel component="legend" className="!text-black !font-semibold !text-lg !mb-4">
          Payment Method <span className="text-[#f74f22]">*</span>
        </FormLabel>
        <RadioGroup
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
          className="space-y-3"
        >
          <FormControlLabel
            value="upi"
            control={<Radio sx={{ "&.Mui-checked": { color: "#F74F22" } }} />}
            label="UPI Payment"
          />
          <FormControlLabel
            value="card"
            control={<Radio sx={{ "&.Mui-checked": { color: "#F74F22" } }} />}
            label="Debit/Credit Card"
          />
        </RadioGroup>
      </FormControl>

      <div className="sm:flex items-center justify-between mt-7">
        <Button
          type="submit"
          className="bg-[#F74F22] px-8 rounded-full py-4 text-[15px] font-semibold text-white hover:bg-[#FFAC00]"
          text="DONATE NOW"
        />
        <p className="text-[20px] font-semibold">
          Donation Total: <span className="text-[#F74F22]">₹{amount || 0}</span>
        </p>
      </div>
    </form>
  );
};

export default DonationForm;
