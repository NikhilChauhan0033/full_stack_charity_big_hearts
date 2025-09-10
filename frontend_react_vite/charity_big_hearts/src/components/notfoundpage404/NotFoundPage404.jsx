import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-[120px] md:text-[200px] font-bold text-[#F74F22] animate-pulse">404</h1>
      <h2 className="text-3xl md:text-5xl font-semibold mt-4 text-center">Oops! Page Not Found</h2>
      <p className="mt-2 text-center text-gray-300 max-w-md">
        The page you are looking for does not exist or has been moved. Let's get you back home.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-[#F74F22] hover:bg-[#fe6136] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
      >
        Go Home
      </button>
     
    </div>
  );
};

export default NotFoundPage;
