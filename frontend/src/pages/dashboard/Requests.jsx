import { useEffect, useState } from "react";
import { getAllRequests, createRequest, changeRequestStatus, assignRequest } from "../../services/request.service";
import { getAllEquipment } from "../../services/equipment.service";
import { getTeams } from "../../services/team.service";
import { useAuth } from "../../hooks/useAuth";

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [draggedRequest, setDraggedRequest] = useState(null);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    equipment: "",
    type: "Corrective",
    priority: "Medium",
    scheduledDate: ""
  });

  const statuses = ["New", "In Progress", "Repaired", "Scrap"];

  useEffect(() => {
    fetchRequests();
    fetchEquipment();
    fetchTeams();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      setRequests(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const data = await getAllEquipment();
      setEquipment(data.data || []);
    } catch (err) {
      console.error("Failed to fetch equipment");
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data.data || []);
    } catch (err) {
      console.error("Failed to fetch teams");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest({
        ...formData,
        createdBy: user.id || user._id
      });
      resetForm();
      fetchRequests();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
    }
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      equipment: "",
      type: "Corrective",
      priority: "Medium",
      scheduledDate: ""
    });
    setShowForm(false);
  };

  const handleDragStart = (e, request) => {
    setDraggedRequest(request);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedRequest) return;

    try {
      await changeRequestStatus(draggedRequest._id, newStatus);
      fetchRequests();
    } catch (err) {
      setError("Failed to update request status");
    }
    setDraggedRequest(null);
  };

  const handleAssign = async (requestId) => {
    try {
      await assignRequest(requestId, user.id || user._id);
      fetchRequests();
    } catch (err) {
      setError("Failed to assign request");
    }
  };

  const getFilteredRequests = (status) => {
    return requests.filter((req) => {
      if (filterType !== "All" && req.type !== filterType) return false;
      return req.status === status;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "border-l-4 border-red-600 bg-red-50";
      case "High":
        return "border-l-4 border-orange-500 bg-orange-50";
      case "Medium":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      default:
        return "border-l-4 border-green-500 bg-green-50";
    }
  };

  const isOverdue = (req) => {
    if (!req.scheduledDate || req.status === "Repaired") return false;
    return new Date(req.scheduledDate) < new Date();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Maintenance Requests</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Top Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setFilterType("All")}
            className={`px-4 py-2 rounded ${filterType === "All" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("Corrective")}
            className={`px-4 py-2 rounded ${filterType === "Corrective" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Corrective
          </button>
          <button
            onClick={() => setFilterType("Preventive")}
            className={`px-4 py-2 rounded ${filterType === "Preventive" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Preventive
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          New Request
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Equipment</option>
                {equipment.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name} ({eq.serialNumber})
                  </option>
                ))}
              </select>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Corrective">Corrective (Breakdown)</option>
                <option value="Preventive">Preventive (Routine Checkup)</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {formData.type === "Preventive" && (
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              )}
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  Create
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
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status) => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-gray-100 rounded-lg p-4 min-h-[500px]"
            >
              <h3 className="font-bold text-lg mb-4">
                {status} ({getFilteredRequests(status).length})
              </h3>
              <div className="space-y-3">
                {getFilteredRequests(status).map((req) => (
                  <div
                    key={req._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, req)}
                    className={`p-3 rounded cursor-move hover:shadow-lg transition ${getPriorityColor(req.priority)}`}
                  >
                    <p className="font-semibold text-sm">{req.subject}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {equipment.find((e) => e._id === req.equipment)?.name || "Unknown"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${req.type === "Preventive" ? "bg-blue-200" : "bg-orange-200"}`}>
                        {req.type}
                      </span>
                      {isOverdue(req) && <span className="text-xs text-red-600">🔴 Overdue</span>}
                    </div>
                    {!req.assignedTo && (
                      <button
                        onClick={() => handleAssign(req._id)}
                        className="mt-2 w-full bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600"
                      >
                        Assign to Me
                      </button>
                    )}
                    {req.assignedTo && (
                      <p className="text-xs mt-2 text-gray-700">👤 {req.assignedTo.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
