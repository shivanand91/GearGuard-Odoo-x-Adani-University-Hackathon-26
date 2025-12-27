import { useState, useEffect } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember } from "../../services/team.service";
import Input from "../../components/common/Input";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    members: []
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      console.log("Teams response:", data);
      setTeams(data?.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch teams error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTeam(editingId, formData);
        setEditingId(null);
      } else {
        const response = await createTeam(formData);
        console.log("Team created:", response);
      }
      resetForm();
      setError("");
      // Add small delay to ensure server processed the request
      setTimeout(() => fetchTeams(), 300);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save team");
      console.error("Team save error:", err);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", members: [] });
    setShowForm(false);
  };

  const handleEdit = (team) => {
    setFormData(team);
    setEditingId(team._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(id);
        fetchTeams();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete team");
      }
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId || !selectedTeam) {
      setError("Please enter a user ID");
      return;
    }
    try {
      await addTeamMember(selectedTeam._id, newMemberId);
      setNewMemberId("");
      setError("");
      // Refresh teams to show new member
      setTimeout(() => fetchTeams(), 300);
    } catch (err) {
      console.error("Add member error:", err);
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!selectedTeam) return;
    try {
      await removeTeamMember(selectedTeam._id, memberId);
      fetchTeams();
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Teams Management</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Create Team
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Team" : "Create New Team"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Team Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedTeam.name} - Members</h2>
            <button
              onClick={() => setShowMembersModal(false)}
              className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>

            <div className="mb-6 pb-4 border-b">
              <h3 className="font-semibold mb-2">Add Member</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter member email or ID"
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleAddMember}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Team Members ({selectedTeam.members?.length || 0})</h3>
              {selectedTeam.members && selectedTeam.members.length > 0 ? (
                <div className="space-y-2">
                  {selectedTeam.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No members in this team</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Teams List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No teams found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
              <h3 className="font-bold text-lg mb-2">{team.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Members: {team.members?.length || 0}</p>

              {team.members && team.members.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Team Members:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {team.members.slice(0, 3).map((member) => (
                      <li key={member._id}>• {member.name}</li>
                    ))}
                    {team.members.length > 3 && (
                      <li>• +{team.members.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowMembersModal(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Manage Members
                </button>
                <button
                  onClick={() => handleEdit(team)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
