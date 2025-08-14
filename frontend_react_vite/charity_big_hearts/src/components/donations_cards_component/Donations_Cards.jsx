import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Button from "../buttoncomponent/Button";
import { Link } from "react-router-dom";

const Donations_Cards = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const scrollIntervalRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem("access"));
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, campRes] = await Promise.all([
          API.get("categories/"),
          API.get("donations/"),
        ]);

        const catMap = {};
        catRes.data.results.forEach((cat) => {
          catMap[cat.id] = cat.name;
        });
        setCategories(catMap);
        setCampaigns(campRes.data.results);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto scroll for screen < xl
  useEffect(() => {
    const startAutoScroll = () => {
      if (window.innerWidth < 1280) {
        const container = containerRef.current;
        if (!container) return;

        const card = container.querySelector(".campaign-card");
        if (!card) return;

        const cardWidth = card.offsetWidth + 24; // 24px = Tailwind's gap-6

        scrollIntervalRef.current = setInterval(() => {
          container.scrollBy({
            left: cardWidth,
            behavior: "smooth",
          });

          // Reset scroll when at end
          if (
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth - 1
          ) {
            setTimeout(() => {
              container.scrollTo({ left: 0, behavior: "smooth" });
            }, 1000); // pause 1s before reset
          }
        }, 3000); // scroll every 3 seconds
      }
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    const handleResize = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    startAutoScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      stopAutoScroll();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCardClick = (id) => {
    navigate(`/donations/detail/${id}`);
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="px-2.5 py-16 md:p-16">
      {/* Header Section */}
      <div className="block md:flex justify-between items-center mb-6">
        <div className="mb-6">
          <p className="uppercase text-[#FFAC00] text-[20px] md:text-[25px]">
            We Help around the world
          </p>
          <p className="text-[30px] md:text-[40px] font-semibold">
            Introduce Our Campaigns
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={scrollLeft}
            className="w-[45px] h-[45px] flex items-center justify-center text-[20px] rounded-full border-2 border-[#FFAC00] mr-3"
          >
            <GoArrowLeft />
          </button>
          <button
            onClick={scrollRight}
            className="w-[45px] h-[45px] flex items-center justify-center text-[20px] rounded-full border-2 border-[#FFAC00]"
          >
            <GoArrowRight />
          </button>
        </div>
      </div>

      {/* Outer Layout */}
      <div className="flex flex-col items-center">
        {/* Scrollable Cards */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar w-full"
        >
          {campaigns.map((campaign) => {
            const percentage = Math.floor(
              (parseFloat(campaign.raised_amount) /
                parseFloat(campaign.goal_amount)) *
                100
            );

            return (
              <div
                key={campaign.id}
                onClick={() => handleCardClick(campaign.id)}
                className="campaign-card min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-xl cursor-pointer hover:shadow-2xl transition flex-shrink-0"
              >
                <div className="relative p-4">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-[200px] object-cover rounded-xl"
                  />
                  <span className="bg-[#f74f22] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2 absolute bottom-[-5px] left-10">
                    {(categories[campaign.category] || "Unknown").toUpperCase()}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">
                    {campaign.title.length > 25
                      ? campaign.title.slice(0, 35) + "..."
                      : campaign.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="relative h-2 bg-[#FFE9C3] rounded-full mt-1">
                      {/* Filled progress */}
                      <div
                        className="absolute top-0 left-0 h-2 bg-[#f74f22] rounded-full"
                        style={{
                          width: `${percentage}%`,
                          transition: "width 0.5s ease",
                        }}
                      ></div>

                      {/* Circle dot at the end of the filled bar */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f74f22] rounded-full z-10"
                        style={{
                          left: `calc(${percentage}% - 8px)`, // 8px = half of 16px (dot size)
                          transition: "left 0.5s ease",
                        }}
                      ></div>

                      {/* Percentage label above the dot */}
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

        {/* View More Button */}
        <div className="text-center mt-6">
         <Link to='/donations'>
          <Button
            onClick={null}
            className="bg-[#f74f22] hover:bg-[#e14417] font-semibold text-white text-sm px-6 py-3 rounded-full shadow-md transition"
            text="View More Donations"
            icon={null}
          />
         </Link>
        </div>
      </div>
    </div>
  );
};

export default Donations_Cards;
