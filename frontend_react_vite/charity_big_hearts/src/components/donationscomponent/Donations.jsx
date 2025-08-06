import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";

const Donations = () => {
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const navigate = useNavigate();

  const fetchCampaigns = async (url = "donations/") => {
    setLoading(true); // ✅ Start loader
    try {
      // Simulate delay for testing loader
      await new Promise((res) => setTimeout(res, 2000));

      const res = await API.get(url);
      if (Array.isArray(res.data.results)) {
        setCampaigns(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
      } else {
        console.error("Campaigns response is not an array:", res.data);
        setCampaigns([]);
      }
    } catch (err) {
      console.error("Campaign error:", err);
      setCampaigns([]);
    } finally {
      setLoading(false); // ✅ End loader
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true); // ✅ Start loader

      try {
        // Simulate delay for testing loader
        // await new Promise((res) => setTimeout(res, 1000));

        // Fetch categories
        const catRes = await API.get("categories/");
        if (Array.isArray(catRes.data.results)) {
          setCategories(catRes.data.results);
        } else {
          console.error("Categories response is not an array:", catRes.data);
          setCategories([]);
        }

        // Fetch campaigns
        await fetchCampaigns();
      } catch (err) {
        console.error("Category error:", err);
        setCategories([]);
      } finally {
        setLoading(false); // ✅ End loader
      }
    };

    fetchAll();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/donations/category/${categoryId}`);
  };

  const handleDetailClick = (id) => {
    navigate(`/donations/detail/${id}`);
  };

  // ✅ Render loader if loading
  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <title>Donations - BigHearts</title>

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