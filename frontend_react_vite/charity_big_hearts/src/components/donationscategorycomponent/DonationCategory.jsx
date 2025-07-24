// src/components/donationcomponent/DonationCategory.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";

const DonationCategory = () => {
  const { id } = useParams(); // category ID
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  API.get(`donations/?category=${id}`)
    .then((res) => {
      console.log("Category campaigns:", res.data);
      if (Array.isArray(res.data.results)) {
        setCampaigns(res.data.results); // ✅ use results from paginated response
      } else {
        setCampaigns([]); // fallback
        console.error("Results is not an array:", res.data);
      }
    })
    .catch((err) => {
      console.error("Error fetching campaigns:", err);
      setCampaigns([]); // fallback in case of error
    });
}, [id]);


  return (
    <div style={{ padding: "20px" }}>
      <h2>Campaigns in Selected Category</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found for this category.</p>
      ) : (
        campaigns.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{c.title}</h3>
            <img
              src={c.image}
              alt={c.title}
              width="200"
              style={{ display: "block", marginBottom: "10px" }}
            />
            <p><strong>Goal:</strong> ₹{c.goal_amount}</p>
            <p><strong>Raised:</strong> ₹{c.raised_amount}</p>
            <p><strong>To Go:</strong> ₹{c.to_go}</p>
            <button onClick={() => navigate(`/donations/detail/${c.id}`)}>
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DonationCategory;
