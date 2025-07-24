// components/teamdetailcomponent/TeamDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../base_api/api';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamMember, setTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMemberDetail = async () => {
      try {
        setLoading(true);
        const response = await API.get(`team/${id}/`);
        setTeamMember(response.data);
        console.log('✅ Team member detail fetched:', response.data);
      } catch (err) {
        console.error('❌ Error fetching team member detail:', err);
        if (err.response?.status === 404) {
          setError('Team member not found.');
        } else {
          setError('Failed to load team member details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeamMemberDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <div>Loading team member details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <button onClick={() => navigate('/team')}>Back to Team</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/team')}>← Back to Team</button>

      <div>
        <div>
          {teamMember.image && (
            <div>
              <img
                src={teamMember.image}
                alt={teamMember.name || 'Team member'}
                style={{ width: '100px' }} // 👈 added only this style
              />
            </div>
          )}

          <div>
            <h1>{teamMember.name || 'No Name'}</h1>

            {teamMember.position && <p>{teamMember.position}</p>}
            {teamMember.email && <p>Email: {teamMember.email}</p>}
            {teamMember.phone && <p>Phone: {teamMember.phone}</p>}
            {teamMember.description && (
              <div>
                <h3>About</h3>
                <p>{teamMember.description}</p>
              </div>
            )}
            {teamMember.experience && (
              <div>
                <h3>Experience</h3>
                <p>{teamMember.experience} years</p>
              </div>
            )}
            {teamMember.skills && (
              <div>
                <h3>Skills</h3>
                <ul>
                  {teamMember.skills.split(',').map((skill, index) => (
                    <li key={index}>{skill.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
            {(teamMember.linkedin || teamMember.twitter || teamMember.facebook) && (
              <div>
                <h3>Connect</h3>
                {teamMember.linkedin && (
                  <a href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {teamMember.twitter && (
                  <a href={teamMember.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
                {teamMember.facebook && (
                  <a href={teamMember.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
