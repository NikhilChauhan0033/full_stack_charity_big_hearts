import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const carouselItems = [
  {
    id: 1,
    title: "Healthy Meals",
    description: "Nutritious food to support underprivileged families.",
    image: "../../../src/assets/images/slide_carousel_images/food_1.jpg", // Must be grayscale image or we'll apply filter
    categoryId: 1,
  },
  {
    id: 2,
    title: "Clean Water",
    description: "Providing safe drinking water across villages.",
    image: "../../../src/assets/images/slide_carousel_images/kids2.jpg",
    categoryId: 4,
  },
  {
    id: 3,
    title: "Education Kit",
    description: "Supporting school children with books and stationery.",
    image: "../../../src/assets/images/slide_carousel_images/education_2.jpg",
    categoryId: 2,
  },
  {
    id: 4,
    title: "Medical Aid",
    description: "Helping those in need with medicines and healthcare.",
    image: "../../../src/assets/images/slide_carousel_images/medicine_1.jpg",
    categoryId: 3,
  },
];

const Slide_Carousel_Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (categoryId) => {
    navigate(`/donations/category/${categoryId}`);
  };

  return (
    <Box className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] relative overflow-hidden">
      {carouselItems.map((item, index) => (
        <Box
          key={item.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Overlay Image (same for all slides) */}
          <img
            src="https://wgl-dsites.net/bighearts/wp-content/uploads/2020/10/home-1_slider-1_3.png"
            alt="Overlay Shape"
            className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
            style={{
              pointerEvents: "none",
              transform: "scale(2.3) rotate(200deg)",
            }} // so it doesn't block button clicks
          />

          {/* Main Carousel Image */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover filter grayscale z-[0]"
          />

          {/* Content */}
          <Box className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black bg-opacity-40 z-[2]">
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                mb: { xs: 1.5, sm: 2, md: 3 },
                typography: { xs: "h4", sm: "h3", md: "h2" },
              }}
              className="drop-shadow-lg"
            >
              {item.title}
            </Typography>

            <Typography
              sx={{
                color: "white",
                fontSize: { xs: "20px", sm: "25px", md: "30px" },
                mb: { xs: 3, sm: 4, md: 5 },
                maxWidth: "40rem",
              }}
              className="drop-shadow-md"
            >
              {item.description}
            </Typography>

            <button
              className="rounded-full px-8 py-3 text-[15px] sm:text-[17px] uppercase font-semibold bg-[#F74F22] hover:bg-[#d84315] text-white"
              onClick={() => handleNavigate(item.categoryId)}
            >
              Learn More
            </button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Slide_Carousel_Home;
