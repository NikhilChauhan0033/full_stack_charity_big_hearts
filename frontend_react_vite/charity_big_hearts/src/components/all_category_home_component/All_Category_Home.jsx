import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const imageData = [
  {
    src: "../../../src/assets/partners_fifth_component/portfolio_01-1-1170x670.jpg",
    title: "Rescue, Love, Save",
    p: "DONATION",
  },
  {
    src: "../../../src/assets/partners_fifth_component/portfolio_02-1170x670.jpg",
    title: "Little Help",
    p: "CHARITY",
  },
  {
    src: "../../../src/assets/partners_fifth_component/portfolio_03-1170x670.jpg",
    title: "Children in Africa",
    p: "AFRICA",
  },
  {
    src: "../../../src/assets/partners_fifth_component/portfolio_04-1170x670.jpg",
    title: "Gift An Education",
    p: "EDUCATION",
  },
  {
    src: "../../../src/assets/partners_fifth_component/portfolio_05-1170x670.jpg",
    title: "Clean Water",
    p: "AFRICA",
  },
];

const All_Category_Home = () => {
  const scrollContainerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startAutoScroll = () => {
      // Only start auto-scroll if screen is below xl (< 1280px)
      if (window.innerWidth < 1280) {
        intervalRef.current = setInterval(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = 200; // Adjust this value to control scroll distance

            // Scroll to the left
            container.scrollLeft += scrollAmount;

            // Reset to beginning when reached the end
            if (
              container.scrollLeft >=
              container.scrollWidth - container.clientWidth
            ) {
              container.scrollLeft = 0;
            }
          }
        }, 2500); // 2.5 second interval
      }
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleResize = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    // Initial setup
    startAutoScroll();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      stopAutoScroll();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex xl:justify-between items-center whitespace-nowrap 
                   overflow-x-auto xl:overflow-visible scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {imageData.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden group w-[275px] h-[260px] cursor-pointer flex-shrink-0"
          >
            {/* Image */}
            <Link to="/donations">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:filter group-hover:grayscale"
              />

              {/* Shutter Overlay */}
              <div
                className="absolute bottom-[-50%] left-0 w-full h-1/2 bg-[#FD853E] text-white 
               flex flex-col justify-center pl-6 transition-all duration-500 group-hover:bottom-0"
              >
                <p className="text-2xl font-semibold">{item.title}</p>
                <p
                  style={{ fontFamily: '"Amatic SC", cursive' }}
                  className="text-lg mt-1"
                >
                  #{item.p}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default All_Category_Home;
