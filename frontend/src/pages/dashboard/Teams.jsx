import { useEffect, useState } from "react";
import { getTeams } from "../../services/team.service";

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await getTeams();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <p className="text-sm text-gray-500">
              Members: {team.members.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
