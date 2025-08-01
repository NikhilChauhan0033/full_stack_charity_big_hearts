import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../base_api/api';
import FullPageLoader from '../loader/FullPageLoader'; // 👈 import loader here

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await API.get('team/');
        setTeamMembers(response.data.results || response.data);
        console.log('✅ Team data fetched successfully:', response.data);
      } catch (err) {
        console.error('❌ Error fetching team data:', err);
        setError('Failed to load team members. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleTeamMemberClick = (id) => {
    navigate(`/team/${id}`);
  };

  // ⏳ Show loader while loading
  if (loading) return <FullPageLoader />;

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <title>Our Team - BigHearts</title>
      <h1 className="text-3xl font-bold mb-6">Our Team</h1>

      {teamMembers.length === 0 ? (
        <p>No team members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleTeamMemberClick(member.id)}
              className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
            >
              {member.image && (
                <div className="mb-3">
                  <img
                    src={member.image}
                    alt={member.name || 'Team member'}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}

              <h3 className="text-xl font-semibold">
                {member.name || 'No Name'}
              </h3>

              {member.position && <p className="text-gray-600">{member.position}</p>}

              {member.description && (
                <p className="text-sm text-gray-700 mt-2">
                  {member.description.length > 100
                    ? `${member.description.substring(0, 100)}...`
                    : member.description}
                </p>
              )}

              {member.email && <p className="text-sm mt-2">📧 {member.email}</p>}

              <div className="mt-4">
                <button className="text-[#F74F22] font-medium hover:underline">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
