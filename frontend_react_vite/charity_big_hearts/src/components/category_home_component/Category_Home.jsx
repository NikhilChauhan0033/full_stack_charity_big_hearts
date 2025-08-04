import { useState } from "react";
import {
  FaUtensils,
  FaBook,
  FaChild,
  FaBriefcaseMedical,
} from "react-icons/fa";

import { TfiPlus, TfiClose } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Food",
    icon: <FaUtensils size={40} />,
    image: "../../../src/assets/images/slide_carousel_images/food_1.jpg",
    description:
      "We provide nutritious food for the hungry and underprivileged. Join us in fighting hunger and spreading smiles.",
  },
  {
    id: 2,
    name: "Education",
    icon: <FaBook size={40} />,
    image: "../../../src/assets/images/slide_carousel_images/education_2.jpg",
    description:
      "Education empowers children to change the world. Support school kits, books, and more.",
  },
  {
    id: 4,
    name: "Children",
    icon: <FaChild size={40} />,
    image: "../../../src/assets/images/slide_carousel_images/kids2.jpg",
    description:
      "Every child deserves a safe and happy childhood. Help us protect and care for children in need.",
  },
  {
    id: 3,
    name: "Medical",
    icon: <FaBriefcaseMedical size={40} />,
    image: "../../../src/assets/images/slide_carousel_images/medicine_1.jpg",
    description:
      "We provide medicines, treatments, and health camps to underserved communities. Be part of their healing.",
  },
];

const Category_Home = () => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/donations/category/${id}`);
  };

  return (
    <div className="grid xl:grid-cols-4 gap-0">
      {categories.map((cat, idx) => (
        <div
          key={cat.id}
          className="relative w-full h-[80vh] group cursor-pointer"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleNavigate(cat.id)}
        >
          {/* Image */}
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover filter grayscale"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex flex-col justify-center items-start px-6 py-8 transition-all duration-500">
            <div className="flex flex-col gap-2">
              <div className="text-white">{cat.icon}</div>
              <h3 className="text-3xl font-semibold">
                Donate for{" "}
                <span className="text-[#F74F22] group-hover:text-[#FFAC00] transition-colors duration-300">
                  {cat.name}
                </span>
              </h3>

              {/* Slide-up Description */}
              <p
                className={`transition-all duration-500 text-[20px] max-w-[90%] overflow-hidden ${
                  hovered === idx
                    ? "max-h-32 translate-y-0 opacity-100 mt-2"
                    : "max-h-0 opacity-0 -translate-y-4"
                }`}
              >
                {cat.description}
              </p>
            </div>
          </div>

          {/* Capsule Button */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // prevent bubbling to image div
              handleNavigate(cat.id);
            }}
            className={`absolute bottom-4 left-[-40px] w-[150px] h-[60px] rounded-r-full flex items-center justify-end pr-2 shadow-lg z-10 transition-colors duration-300 ${
              hovered === idx ? "bg-[#FFAC00]" : "bg-[#F74F22]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-700 ${
                hovered === idx
                  ? "text-[#FFAC00] rotate-[1080deg]"
                  : "text-[#F74F22]"
              }`}
            >
              {hovered === idx ? <TfiPlus size={20} /> : <TfiClose size={20} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Category_Home;
