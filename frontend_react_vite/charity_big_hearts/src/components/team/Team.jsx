import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../base_api/api';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
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

  if (loading) {
    return (
      <div>
        <div>Loading team members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Our Team</h1>
      
      {teamMembers.length === 0 ? (
        <div>
          <p>No team members found.</p>
        </div>
      ) : (
        <div>
          {teamMembers.map((member) => (
            <div key={member.id} onClick={() => handleTeamMemberClick(member.id)}>
              {member.image && (
                <div style={{width:'100px'}}>
                  <img
                    src={member.image}
                    alt={member.name || 'Team member'}
                    style={{width:'100px'}}
                  />
                </div>
              )}
              
              <div>
                <h3>{member.name || 'No Name'}</h3>
                
                {member.position && (
                  <p>{member.position}</p>
                )}
                
                {member.description && (
                  <p>
                    {member.description.length > 100
                      ? `${member.description.substring(0, 100)}...`
                      : member.description}
                  </p>
                )}
                
                {member.email && (
                  <p>📧 {member.email}</p>
                )}
                
                <div>
                  <button>View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
