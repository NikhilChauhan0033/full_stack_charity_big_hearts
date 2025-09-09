import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import Button from "../buttoncomponent/Button";

const DonationForm = ({ amount, onSubmit, setToastMessage, setToastType }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("upi");

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // validate donation amount
  const validateDonationAmount = (amt) => {
    const num = parseFloat(amt);
    if (isNaN(num) || num <= 0) return "Please enter a valid donation amount.";
    if (num < 10) return "Minimum donation amount is ₹10.";
    if (num > 1000000) return "Maximum donation amount is ₹10,00,000.";
    return null;
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setToastMessage?.("Please login to donate.");
      setToastType?.("error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const error = validateDonationAmount(amount);
    if (error) {
      setToastMessage?.(error);
      setToastType?.("error");
      return;
    }

    // Pass donor info + payment method to parent
    onSubmit({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      payment_mode: selectedPayment,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <p className="font-semibold text-xl mb-4">Personal Info</p>

      {/* First + Last Name */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/2">
          <label className="block mb-1">
            First Name <span className="text-[#f74f22]">*</span>
          </label>
          <input
            required
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full py-3 px-5 border border-gray-400 rounded-full outline-none"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <label className="block mb-1">
            Last Name <span className="text-[#f74f22]">*</span>
          </label>
          <input
            required
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full py-3 px-5 border border-gray-400 rounded-full outline-none"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1">
          Email <span className="text-[#f74f22]">*</span>
        </label>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email Address"
          className="w-full py-3 px-5 border border-gray-400 rounded-full outline-none"
        />
      </div>

      {/* Payment Method */}
      <div className="w-full mt-6">
        <FormControl component="fieldset" className="w-full">
          <FormLabel
            component="legend"
            className="!text-black !font-semibold !text-lg !mb-4"
          >
            Payment Method <span className="text-[#f74f22]">*</span>
          </FormLabel>

          <RadioGroup
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="space-y-3"
          >
            <div className="border border-gray-300 rounded-lg p-4 hover:border-[#F74F22] transition-colors">
              <FormControlLabel
                value="upi"
                control={<Radio sx={{ "&.Mui-checked": { color: "#F74F22" } }} />}
                label={
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📱</div>
                    <div>
                      <p className="font-semibold">UPI Payment</p>
                      <p className="text-sm text-gray-600">
                        Google Pay, PhonePe, Paytm, etc.
                      </p>
                    </div>
                  </div>
                }
                className="m-0 w-full"
              />
            </div>

            <div className="border border-gray-300 rounded-lg p-4 hover:border-[#F74F22] transition-colors">
              <FormControlLabel
                value="card"
                control={<Radio sx={{ "&.Mui-checked": { color: "#F74F22" } }} />}
                label={
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💳</div>
                    <div>
                      <p className="font-semibold">Debit/Credit Card</p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, RuPay, etc.
                      </p>
                    </div>
                  </div>
                }
                className="m-0 w-full"
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>

      {/* Buttons */}
      <div className="sm:flex items-center justify-between mt-7">
        <Button
          type="submit"
          className="group flex items-center bg-[#F74F22] px-8 rounded-full py-4 text-[15px] font-semibold text-white hover:bg-[#FFAC00] mb-5"
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
