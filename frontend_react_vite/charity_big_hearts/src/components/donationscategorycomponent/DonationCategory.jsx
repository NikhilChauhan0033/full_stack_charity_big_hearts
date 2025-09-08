import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_typography.jpg";

const DonationCategory = () => {
  const { id } = useParams(); // category ID
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");

    // ✅ Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // fetch all categories
        const catRes = await API.get("categories/");
        if (Array.isArray(catRes.data.results)) {
          setCategories(catRes.data.results);

          // find category name by id
          const foundCategory = catRes.data.results.find(
            (cat) => String(cat.id) === String(id)
          );
          if (foundCategory) {
            setCategoryName(foundCategory.name);
          }
        }

        // fetch campaigns in category
        const res = await API.get(`donations/?category=${id}`);
        const data = res.data.results || [];
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching category campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const categoriesMap = {};
  categories.forEach((cat) => {
    categoriesMap[cat.id] = cat.name;
  });

  if (loading) return <FullPageLoader />;

  return (
    <>
      <title>Donations Category - BigHearts</title>
      <Header_Repeat
        bgImage={bgImage}
        secondlocate="/donations"
        Title="Donations Category"
        smallTitle="donations category"
        currentPage={categoryName}
      />

      <div className="px-3 py-10 sm:p-16 md:p-20 xl:p-24">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
          Category - <span style={{ fontFamily: '"Amatic SC", cursive' }} className="uppercase text-[#ffac00]">{categoryName}</span>
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-center text-gray-600">
            No campaigns found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {campaigns.map((campaign) => {
              const percentage = Math.floor(
                (parseFloat(campaign.raised_amount) /
                  parseFloat(campaign.goal_amount)) *
                  100
              );
              return (
                <div
                  key={campaign.id}
                  onClick={() => navigate(`/donations/detail/${campaign.id}`)}
                  className="bg-white rounded-xl shadow-xl cursor-pointer hover:shadow-2xl transition"
                >
                  <div className="relative p-4">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-[200px] object-cover rounded-xl"
                    />
                    <span className="bg-[#f74f22] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2 absolute bottom-[-5px] left-10">
                      {(
                        categoriesMap[campaign.category] || "Unknown"
                      ).toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-2xl font-bold mb-2">
                      {campaign.title.length > 35
                        ? campaign.title.slice(0, 35) + "..."
                        : campaign.title}
                    </h3>

                    <div className="mb-4 mt-7">
                      <div className="relative h-2 bg-[#FFE9C3] rounded-full mt-1">
                        <div
                          className="absolute top-0 left-0 h-2 bg-[#f74f22] rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f74f22] rounded-full z-10"
                          style={{ left: `calc(${percentage}% - 8px)` }}
                        ></div>
                        <div
                          className="absolute -top-6 text-sm font-bold text-black"
                          style={{ left: `calc(${percentage}% - 12px)` }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm font-medium mt-3">
                      <div>
                        <p className="text-gray-600">Goal:</p>
                        <p className="text-[#f74f22] font-semibold">
                          ₹{parseFloat(campaign.goal_amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Raised:</p>
                        <p className="text-[#fb8518] font-semibold">
                          ₹{parseFloat(campaign.raised_amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">To Go:</p>
                        <p className="text-[#ffac00] font-semibold">
                          ₹{parseFloat(campaign.to_go).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default DonationCategory;
