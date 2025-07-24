// src/components/donationcomponent/DonationDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../base_api/api";

const DonationDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    donation_amount: "",
    payment_mode: "upi",
  });

  useEffect(() => {
    API.get(`donations/${id}/`)
      .then((res) => setCampaign(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      await API.post("donate/", { ...form, campaign: id });
      alert("Thank you for your donation!");
    } catch (err) {
      console.error("Donation failed", err);
    }
  };

  if (!campaign) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{campaign.title}</h2>
      <img src={campaign.image} alt={campaign.title} width="300" />
      <p>Goal: ₹{campaign.goal_amount}</p>
      <p>Raised: ₹{campaign.raised_amount}</p>
      <p>To Go: ₹{campaign.to_go}</p>

      <h3>Donate Now</h3>
      <form onSubmit={handleDonate}>
        <input name="name" placeholder="Name" onChange={handleChange} required /><br />
        <input name="surname" placeholder="Surname" onChange={handleChange} required /><br />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required /><br />
        <input name="donation_amount" placeholder="Amount" type="number" onChange={handleChange} required /><br />
        <select name="payment_mode" onChange={handleChange}>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="paypal">PayPal</option>
        </select><br />
        <button type="submit">Donate</button>
      </form>
    </div>
  );
};

export default DonationDetail;
