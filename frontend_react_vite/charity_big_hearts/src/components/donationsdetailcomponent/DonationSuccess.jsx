import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "../buttoncomponent/Button";
import { FaCheckCircle } from "react-icons/fa";

const DonationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, campaignTitle, donorName } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!location.state) {
      navigate("/donations");
    }
  }, [location.state, navigate]);

  return (
    <>
      <title>Donation Successful - BigHearts</title>

      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4 sm:p-6">
              <FaCheckCircle className="text-green-600 text-4xl sm:text-6xl animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Thank You, {donorName || "Donor"}! 🎉
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Your donation has been successfully processed.
          </p>

          {/* Thank You Note */}
          <div className="bg-orange-50 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 shadow-sm">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#F74F22] mb-3">
              Your Kindness Creates Hope ❤️
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Every contribution, no matter the size, helps us move closer to
              our mission. Together, we’re building a brighter and kinder world.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/donations")}
              className="w-full sm:w-auto bg-[#F74F22] hover:bg-[#d84315] text-white px-5 py-3 rounded-full font-semibold transition-transform transform hover:scale-105"
              text="Explore More Campaigns"
            />
            <Button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto border-2 border-[#F74F22] text-[#F74F22] hover:bg-[#F74F22] hover:text-white px-5 py-3 rounded-full font-semibold transition-transform transform hover:scale-105"
              text="Go Home"
            />
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              A confirmation email has been sent to your inbox. For any help,
              contact{" "}
              <span className="font-medium text-[#F74F22]">
                support@bighearts.org
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationSuccess;
