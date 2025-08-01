// src/components/donationcomponent/DonationCategory.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";

const DonationCategory = () => {
  const { id } = useParams(); // category ID
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCampaigns = async () => {
      setLoading(true);
      try {
        const res = await API.get(`donations/?category=${id}`);
        const data = res.data.results || [];
        if (Array.isArray(data)) {
          setCampaigns(data);
        } else {
          console.error("Campaign data is not an array:", res.data);
          setCampaigns([]);
        }
      } catch (error) {
        console.error("Error fetching category campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCampaigns();
  }, [id]);

  if (loading) return <FullPageLoader />;

  return (
    <div style={{ padding: "20px" }}>
      <title>Donations Category - BigHearts</title>
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
