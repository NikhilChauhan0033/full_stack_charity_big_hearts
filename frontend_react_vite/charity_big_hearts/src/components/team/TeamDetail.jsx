import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_team.jpg";
import bgTeamImage from "../../../src/assets/team_bg.jpg";
import { IoIosArrowForward } from "react-icons/io";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamMember, setTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        setLoading(true);
        const response = await API.get(`team/${id}/`);
        setTeamMember(response.data);
      } catch (err) {
        setError("Failed to load team member details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  if (loading) return <FullPageLoader />;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!teamMember) return null;

  return (
    <>
      <title>Team Member Detail - BigHearts</title>
      <Header_Repeat
        bgImage={bgImage}
        secondlocate="/team"
        Title="Team"
        smallTitle="team"
        currentPage={teamMember.name}
      />

      <div className="px-3 py-10 md:p-14">
        <div
          className="p-6 sm:p-10 w-full h-full bg-cover bg-center rounded-xl flex flex-col md:flex-row items-center md:items-start justify-center gap-10"
          style={{ backgroundImage: `url(${bgTeamImage})` }}
        >
          {/* Image Section */}
          <div className="w-full md:w-[40%] flex justify-center">
            <img
              src={teamMember.image}
              alt={teamMember.name}
              className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] object-cover rounded-full shadow-lg"
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-[60%] text-center md:text-left flex flex-col items-center md:items-start">
            <p className="text-3xl font-bold mb-2">{teamMember.name}</p>
            <p className="text-[#F74F22] font-medium text-lg mb-4">
              {teamMember.role || "Volunteer"}
            </p>
            {teamMember.small_description && (
              <p className="text-gray-600 mb-6 max-w-lg">
                {teamMember.small_description}
              </p>
            )}

            <div className="space-y-5 text-center md:text-left">
              {teamMember.experience && (
                <p className="text-gray-600">
                  <strong className="text-black mr-2">Experience: </strong>{" "}
                  {teamMember.experience}
                </p>
              )}
              {teamMember.email && (
                <p className="text-gray-600">
                  <strong className="text-black mr-2">Email: </strong>{" "}
                  {teamMember.email}
                </p>
              )}
              {teamMember.phone_no && (
                <p className="text-gray-600">
                  <strong className="text-black mr-2">Phone: </strong>{" "}
                  {teamMember.phone_no}
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start mt-6 gap-4">
              <a
                href="#"
                className="p-3 rounded-full border border-[#ffac00] hover:bg-[#ffac00] hover:text-white transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="p-3 rounded-full border border-[#ffac00] hover:bg-[#ffac00] hover:text-white transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-3 rounded-full border border-[#ffac00] hover:bg-[#ffac00] hover:text-white transition"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="p-3 rounded-full border border-[#ffac00] hover:bg-[#ffac00] hover:text-white transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDetail;
