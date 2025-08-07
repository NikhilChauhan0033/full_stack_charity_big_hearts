import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api";
import FullPageLoader from "../loader/FullPageLoader";
import Header_Repeat from "../header_repeat_component/Header_Repeat";
import bgImage from "../../../src/assets/pagetitle_team.jpg";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import Fifth_Home from "../fifth_home_component/Fifth_Home";
const partnerImages = [
  "partners_01-w.png",
  "partners_02-w.png",
  "partners_03-w.png",
  "partners_04-w.png",
  "partners_05-w.png",
  "partners_06-w.png",
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await API.get("team/");
        setTeamMembers(response.data.results || response.data);
        console.log("✅ Team data fetched successfully:", response.data);
      } catch (err) {
        console.error("❌ Error fetching team data:", err);
        setError("Failed to load team members. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleTeamMemberClick = (id) => {
    navigate(`/team/${id}`);
  };

  if (loading) return <FullPageLoader />;

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <title>Our Team - BigHearts</title>
      <Header_Repeat bgImage={bgImage} Title="Our Team" smallTitle="Our Team" />

      <div className="text-center px-5 py-16 md:p-20">
        <p className="uppercase text-[25px] text-[#ffac00]">
          professional team
        </p>
        <p className="capitalize text-[30px]  md:text-[35px] font-semibold mb-3">
          Meet Our Volunteer Team
        </p>
        <p className=" w-full md:w-1/2 m-auto text-[18px] text-gray-500">
          Nisl rhoncus mattis rhoncus urna. Ullamcorper malesuada proin libero
          nunc consequat interdum varius sit amet. Pharetra magna ac placerat
          vestibulum
        </p>

        <div className="pt-16 max-w-6xl mx-auto">
          {teamMembers.length === 0 ? (
            <p className="text-center">No team members found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleTeamMemberClick(member.id)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name || "Team member"}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:grayscale"
                    />

                    {/* Social Media Bar - Slides from right to left */}
                    <div className="absolute bottom-4 right-0 overflow-hidden">
                      <div className="bg-[#F74F22] rounded-l-full pl-2 pr-6 py-2 flex items-center gap-4 transition-all duration-500 ease-out transform sm:translate-x-48 group-hover:translate-x-0">
                        {/* Share Button - White circle, always visible */}
                        <div className="bg-white p-3 rounded-full">
                          <FiShare2 className="h-5 w-5 text-[#F74F22]" />
                        </div>

                        {/* Social Icons */}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="text-white w-[30px] h-[30px] rounded-full  border-[1px] border-white p-1.5 text-[15px] transition-colors duration-200"
                        >
                          <FaTwitter />
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="text-white w-[30px] h-[30px] rounded-full  border-[1px] border-white p-1.5 text-[15px] transition-colors duration-200"
                        >
                          <FaFacebookF />
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="text-white w-[30px] h-[30px] rounded-full  border-[1px] border-white p-1.5 text-[15px] transition-colors duration-200"
                        >
                          <FaLinkedinIn />
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="text-white w-[30px] h-[30px] rounded-full  border-[1px] border-white p-1.5 text-[15px] transition-colors duration-200"
                        >
                          <FaInstagram />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 py-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                    </div>
                    <hr className="my-3" />
                    {/* Signature */}
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-base font-medium">
                        {member.role}
                      </p>
                      <p className="text-[#F74F22] font-bold text-xl italic">
                        {member.signature ||
                          (member.name
                            ? member.name.split(" ").pop()
                            : "Signature")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Fifth_Home
        bgImage={null}
        bgColor="#FD853E"
        partnerImages={partnerImages}
      />
    </>
  );
};

export default Team;
