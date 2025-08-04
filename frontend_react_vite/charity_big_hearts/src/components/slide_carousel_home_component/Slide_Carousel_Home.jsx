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
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover filter grayscale"
          />
          <Box className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black bg-opacity-40">
            {/* Responsive Title */}
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                mb: { xs: 1.5, sm: 2, md: 3 },
                typography: {
                  xs: "h4",
                  sm: "h3",
                  md: "h2",
                },
              }}
              className="drop-shadow-lg"
            >
              {item.title}
            </Typography>

            {/* Responsive Description */}
            <Typography
              sx={{
                color: "white",
                fontSize: {
                  xs: "20px",
                  sm: "25px",
                  md: "30px",
                },
                mb: { xs: 3, sm: 4, md: 5 },
                maxWidth: "40rem",
              }}
              className="drop-shadow-md"
            >
              {item.description}
            </Typography>

            {/* Rounded Button */}
            <Button
              variant="contained"
              sx={{
                borderRadius: "9999px", // Fully rounded
                px: 4,
                py: 1.5,
                fontSize: "16px",
                backgroundColor: "#F74F22",
                "&:hover": { backgroundColor: "#d84315" },
              }}
              onClick={() => handleNavigate(item.categoryId)}
            >
              Explore
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Slide_Carousel_Home;
