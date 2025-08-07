import { useEffect, useRef } from "react";



const Fifth_Home = ({bgImage,bgColor,partnerImages}) => {
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
        }, 2500); // 1 second interval
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
    <div style={{ backgroundImage: `url(${bgImage})`, backgroundColor:`${bgColor}`}} className="overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex xl:justify-between items-center gap-10 whitespace-nowrap 
                   overflow-x-auto xl:overflow-visible scroll-smooth hide-scrollbar p-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {partnerImages.map((img, index) => (
          <div
            key={index}
            className="relative overflow-hidden group flex-shrink-0"
          >
            {/* Top image that slides up on hover */}
            <img
              src={`../../../src/assets/partners_fifth_component/${img}`}
              alt=""
              className="absolute inset-0 transition-transform duration-500 group-hover:-translate-y-full z-10"
            />

            {/* Bottom image that slides in on hover */}
            <img
              src={`../../../src/assets/partners_fifth_component/${img}`}
              alt=""
              className="relative transition-transform duration-500 translate-y-full group-hover:translate-y-0 z-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fifth_Home;
