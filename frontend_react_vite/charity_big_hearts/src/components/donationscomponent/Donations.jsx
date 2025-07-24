// src/components/donationcomponent/Donations.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api";

const Donations = () => {
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const navigate = useNavigate();

  const fetchCampaigns = (url = "donations/") => {
    API.get(url)
      .then((res) => {
        if (Array.isArray(res.data.results)) {
          setCampaigns(res.data.results);
          setNextPage(res.data.next);
          setPrevPage(res.data.previous);
        } else {
          console.error("Campaigns response is not an array:", res.data);
          setCampaigns([]);
        }
      })
      .catch((err) => {
        console.error("Campaign error:", err);
        setCampaigns([]);
      });
  };

  useEffect(() => {
    // Fetch categories
    API.get("categories/")
      .then((res) => {
        if (Array.isArray(res.data.results)) {
          setCategories(res.data.results);
          
        } else {
          console.error("Categories response is not an array:", res.data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Category error:", err);
        setCategories([]);
      });

    // Fetch campaigns
    fetchCampaigns();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/donations/category/${categoryId}`);
  };

  const handleDetailClick = (id) => {
    navigate(`/donations/detail/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Donations</h1>

      <h3>Filter by Category</h3>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        categories.map((cat) => (
          <button
            key={cat.id}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))
      )}

      <hr />

      <h2>All Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns available.</p>
      ) : (
        <>
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <h3>{campaign.title}</h3>
              <img
                src={campaign.image}
                alt={campaign.title}
                width="200"
                style={{ borderRadius: "4px" }}
              />
              <p>Goal: ₹{campaign.goal_amount}</p>
              <p>Raised: ₹{campaign.raised_amount}</p>
              <button>{campaign.category}</button>
              <button onClick={() => handleDetailClick(campaign.id)}>
                View Details
              </button>
            </div>
          ))}

          {/* Pagination Buttons */}
          <div style={{ marginTop: "20px" }}>
            {prevPage && (
              <button
                style={{ marginRight: "10px" }}
                onClick={() => fetchCampaigns(prevPage)}
              >
                Previous
              </button>
            )}
            {nextPage && (
              <button onClick={() => fetchCampaigns(nextPage)}>Next</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Donations;
