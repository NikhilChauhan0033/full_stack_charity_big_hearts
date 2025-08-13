import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Header_Repeat = ({
  bgImage,
  Title,
  smallTitle,
  currentPage,
  secondlocate,
}) => {
  return (
    <div
      className="w-full h-[60vh] bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-2"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <p className="text-[50px] font-semibold mb-4 capitalize">{Title}</p>
      <p className="flex items-center text-[12px]  sm:text-sm font-semibold uppercase">
        <Link to="/" className="hover:text-[#ffac00] duration-200">
          Home
        </Link>
        <IoIosArrowForward className="text-[14px] mx-[5px] sm:mx-[10px]" />
        <Link to={`${secondlocate}`} className="text-[#ffac00] duration-200">
          {smallTitle}
        </Link>
        {currentPage && (
          <>
            <IoIosArrowForward className="text-[14px] mx-[10px]" />
            <span className="text-[#ffac00]">{currentPage}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default Header_Repeat;
