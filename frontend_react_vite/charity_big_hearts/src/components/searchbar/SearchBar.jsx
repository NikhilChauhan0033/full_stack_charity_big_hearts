import { useNavigate } from "react-router-dom";
import API from "../base_api/api";
import { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return;

    try {
      // 1️⃣ Check if it matches any category name
      const catRes = await API.get("categories/");
      const categories = catRes.data.results || catRes.data;

      const matchedCat = categories.find(
        (cat) => cat.name.toLowerCase() === trimmed
      );

      if (matchedCat) {
        navigate(`/donations/category/${matchedCat.id}`);
        return;
      }

      // 2️⃣ Check if it matches any donation campaign title
      const titleRes = await API.get(`donations/?search=${trimmed}`);
      const matchedCampaign = titleRes.data.results?.find((c) =>
        c.title.toLowerCase() === trimmed
      );

      if (matchedCampaign) {
        navigate(`/donations/detail/${matchedCampaign.id}`);
        return;
      }

      // 3️⃣ No match → redirect to categories
      navigate("/donations");
    } catch (err) {
      console.error("Search error:", err);
      navigate("/donations");
    }
  };

  return (
    <div className="flex items-center gap-2 my-4">
      <input
        type="text"
        placeholder="Search by title or category"
        className="border p-2 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        className="bg-[#F74F22] text-white px-4 py-2 rounded-md hover:bg-orange-700"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
