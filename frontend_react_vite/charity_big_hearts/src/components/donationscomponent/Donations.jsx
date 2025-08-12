import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_typography.jpg";


const Donations = () => {
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem("access"));

  // Added for dynamic pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchCampaigns = async (url = "donations/") => {
    setLoading(true);
    try {
      // Simulate delay for loader
      await new Promise((res) => setTimeout(res, 2000));

      const res = await API.get(url);
      if (Array.isArray(res.data.results)) {
        setCampaigns(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
        setTotalCount(res.data.count || 0);

        // Current page from URL
        if (url.includes("page=")) {
          const pageMatch = url.match(/page=(\d+)/);
          setCurrentPage(pageMatch ? parseInt(pageMatch[1]) : 1);
        } else {
          setCurrentPage(1);
        }

        // Calculate total pages (adjust itemsPerPage if different)
        const itemsPerPage = 10;
        setTotalPages(Math.ceil((res.data.count || 0) / itemsPerPage));
      } else {
        console.error("Campaigns response is not an array:", res.data);
        setCampaigns([]);
      }
    } catch (err) {
      console.error("Campaign error:", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
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
        setLoading(false);
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

  const handleDonate = () => {
    if (!token) {
      alert("Please login to donate.");
      navigate("/login");
    } else {
      navigate("/donations");
    }
  };

  // Dynamic pagination handler
  const handlePageClick = (pageNumber) => {
    const url = `donations/?page=${pageNumber}`;
    fetchCampaigns(url);
  };

  // Pages display logic
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        start = 1;
        end = maxVisiblePages;
      } else if (currentPage > totalPages - 3) {
        start = totalPages - maxVisiblePages + 1;
        end = totalPages;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Map category IDs to names
  const categoriesMap = {};
  categories.forEach((cat) => {
    categoriesMap[cat.id] = cat.name;
  });

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <title>Donations - BigHearts</title>
      <Header_Repeat
        bgImage={bgImage}
        Title="donations"
        smallTitle="Donations"
      />

      <div className="px-3 py-10 sm:p-16  md:p-20 xl:p-28">
        <div className="text-center">
          <p
            style={{ fontFamily: '"Amatic SC", cursive' }}
            className="text-[#ffac00] uppercase text-[17px] sm:text-[24px]"
          >
            We Help around the world
          </p>
          <p className="capitalize text-[30px] sm:text-[40px] font-semibold mb-6">
            Introduce Our Campaigns
          </p>
        </div>

        {/* Grid Cards Section */}
        <div className="mb-12">
          {campaigns.length === 0 ? (
            <p className="text-center text-gray-600">No campaigns available.</p>
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
                    onClick={() => handleDetailClick(campaign.id)}
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
                        {campaign.title.length > 25
                          ? campaign.title.slice(0, 35) + "..."
                          : campaign.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="mb-4 mt-7">
                        <div className="relative h-2 bg-[#FFE9C3] rounded-full mt-1">
                          <div
                            className="absolute top-0 left-0 h-2 bg-[#f74f22] rounded-full"
                            style={{
                              width: `${percentage}%`,
                              transition: "width 0.5s ease",
                            }}
                          ></div>

                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f74f22] rounded-full z-10"
                            style={{
                              left: `calc(${percentage}% - 8px)`,
                              transition: "left 0.5s ease",
                            }}
                          ></div>

                          <div
                            className="absolute -top-6 text-sm font-bold text-black"
                            style={{
                              left: `calc(${percentage}% - 12px)`,
                              transition: "left 0.5s ease",
                            }}
                          >
                            {percentage}%
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
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
                            ₹
                            {parseFloat(
                              campaign.raised_amount
                            ).toLocaleString()}
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

          {/* Dynamic Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-8">
              {prevPage && (
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 text-gray-600 flex items-center justify-center hover:border-[#f74f22] hover:text-[#f74f22] transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {getVisiblePages().map((pageNum, index) => {
                const isActive = pageNum === currentPage;
                const visiblePages = getVisiblePages();
                const showDotsBefore = index === 0 && visiblePages[0] > 2;
                const showDotsAfter =
                  index === visiblePages.length - 1 &&
                  visiblePages[visiblePages.length - 1] < totalPages - 1;

                return (
                  <div key={pageNum} className="flex items-center gap-2">
                    {showDotsBefore && pageNum > 1 && (
                      <>
                        <button
                          onClick={() => handlePageClick(1)}
                          className="w-12 h-12 rounded-full border-2 border-gray-200 text-gray-600 font-semibold flex items-center justify-center hover:border-[#f74f22] hover:text-[#f74f22] transition"
                        >
                          1
                        </button>
                        <span className="text-gray-400 font-bold px-2">
                          ...
                        </span>
                      </>
                    )}

                    <button
                      onClick={() => handlePageClick(pageNum)}
                      className={`w-12 h-12 rounded-full font-semibold flex items-center justify-center transition ${
                        isActive
                          ? "bg-[#f74f22] text-white hover:bg-[#e14417]"
                          : "border-2 border-gray-200 text-gray-600 hover:border-[#f74f22] hover:text-[#f74f22]"
                      }`}
                    >
                      {pageNum}
                    </button>

                    {showDotsAfter && pageNum < totalPages && (
                      <>
                        <span className="text-gray-400 font-bold px-2">
                          ...
                        </span>
                        <button
                          onClick={() => handlePageClick(totalPages)}
                          className="w-12 h-12 rounded-full border-2 border-gray-200 text-gray-600 font-semibold flex items-center justify-center hover:border-[#f74f22] hover:text-[#f74f22] transition"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}

              {nextPage && (
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 text-gray-600 flex items-center justify-center hover:border-[#f74f22] hover:text-[#f74f22] transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Section */}
      <div className="px-16 pb-8">
        <h3 className="text-2xl font-semibold mb-4">Filter by Category</h3>
        {categories.length === 0 ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="px-4 py-2 bg-[#ffac00] hover:bg-[#e69500] text-white rounded-full transition"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Donations;
