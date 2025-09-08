import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "../buttoncomponent/Button";
import { FaExclamationTriangle } from "react-icons/fa";

const DonationError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <title>Donation Failed - BigHearts</title>

      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4 sm:p-6">
              <FaExclamationTriangle className="text-red-600 text-4xl sm:text-6xl animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Oops! Donation Failed
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Something went wrong while processing your donation. Don’t
            worry—your card wasn’t charged.
          </p>

          {/* Possible Causes */}
          <div className="rounded-2xl p-4 sm:p-6 mb-8 text-red-600 bg-red-50 text-left">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3">
              Why This Happened?
            </h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
              <li>Temporary network or server issue</li>
              <li>Payment information couldn’t be verified</li>
              <li>High traffic on our servers</li>
            </ul>
          </div>

          {/* Retry Message */}
          <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#F74F22] mb-3">
              Good News! 💡
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              No payment has been deducted. You can safely retry your donation
              or explore other campaigns.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-[#F74F22] hover:bg-[#d84315] text-white px-5 py-3 rounded-full font-semibold transition-transform transform hover:scale-105"
              text="Try Again"
            />
            <Button
              onClick={() => navigate("/donations")}
              className="w-full sm:w-auto border-2 border-[#F74F22] text-[#F74F22] hover:bg-[#F74F22] hover:text-white px-5 py-3 rounded-full font-semibold transition-transform transform hover:scale-105"
              text="Browse Campaigns"
            />
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              Need help? Contact{" "}
              <span className="font-medium text-[#F74F22]">
                support@bighearts.org | +91-XXXX-XXXX-XX
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationError;
