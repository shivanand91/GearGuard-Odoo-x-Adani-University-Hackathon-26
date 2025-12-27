import { useState, useEffect } from "react";
import { getAllEquipment, createEquipment, updateEquipment, deleteEquipment, markEquipmentAsScrap, getEquipmentMaintenance } from "../../services/equipment.service";
import { getTeams } from "../../services/team.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showMaintenance, setShowMaintenance] = useState(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    category: "Other",
    location: "",
    department: "",
    assignedTeam: "",
    purchaseDate: "",
    warranty: ""
  });

  // Fetch equipment and teams
  useEffect(() => {
    fetchEquipment();
    fetchTeams();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      if (filterDepartment) params.department = filterDepartment;

      const data = await getAllEquipment(params);
      console.log("Equipment response:", data);
      setEquipment(data?.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch equipment error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch equipment");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      console.log("Teams response:", data);
      setTeams(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
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
        await updateEquipment(editingId, formData);
        setEditingId(null);
      } else {
        await createEquipment(formData);
      }
      resetForm();
      fetchEquipment();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save equipment");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      serialNumber: "",
      category: "Other",
      location: "",
      department: "",
      assignedTeam: "",
      purchaseDate: "",
      warranty: ""
    });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await deleteEquipment(id);
        fetchEquipment();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete equipment");
      }
    }
  };

  const handleMarkAsScrap = async (id) => {
    if (window.confirm("Mark this equipment as scrap?")) {
      try {
        await markEquipmentAsScrap(id, "Marked as scrap by user");
        fetchEquipment();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to mark as scrap");
      }
    }
  };

  const handleViewMaintenance = async (id) => {
    try {
      const data = await getEquipmentMaintenance(id);
      setShowMaintenance(id);
      setMaintenanceRequests(data.requests || []);
    } catch (err) {
      setError("Failed to fetch maintenance requests");
    }
  };

  // Group equipment
  const getGroupedEquipment = () => {
    let grouped = {};
    equipment.forEach((item) => {
      let key = "All";
      if (groupBy === "department") key = item.department || "Unassigned";
      else if (groupBy === "category") key = item.category || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return grouped;
  };

  const groupedEquipment = getGroupedEquipment();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Equipment Management</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="IT">IT</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Filter by department..."
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="none">No Grouping</option>
            <option value="department">Group by Department</option>
            <option value="category">Group by Category</option>
          </select>
          <button
            onClick={fetchEquipment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Add Equipment
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Equipment" : "Add New Equipment"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Equipment Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Serial Number"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="border rounded px-3 py-2"
            >
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="IT">IT</option>
              <option value="Other">Other</option>
            </select>
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            />
            <select
              name="assignedTeam"
              value={formData.assignedTeam}
              onChange={handleInputChange}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Input
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleInputChange}
            />
            <Input
              label="Warranty"
              name="warranty"
              value={formData.warranty}
              onChange={handleInputChange}
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

      {/* Maintenance Requests Modal */}
      {showMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Maintenance Requests ({maintenanceRequests.length})
            </h2>
            <button
              onClick={() => setShowMaintenance(null)}
              className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
            {maintenanceRequests.length === 0 ? (
              <p className="text-gray-500">No open maintenance requests</p>
            ) : (
              <div className="space-y-2">
                {maintenanceRequests.map((req) => (
                  <div
                    key={req._id}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100"
                  >
                    <p className="font-semibold">{req.subject}</p>
                    <p className="text-sm text-gray-600">Status: {req.status}</p>
                    <p className="text-sm text-gray-600">Type: {req.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipment List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : Object.keys(groupedEquipment).length === 0 ? (
        <div className="text-center py-8 text-gray-500">No equipment found</div>
      ) : (
        Object.entries(groupedEquipment).map(([group, items]) => (
          <div key={group} className="mb-8">
            {groupBy !== "none" && (
              <h2 className="text-xl font-bold mb-4 text-gray-700">{group}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`border rounded-lg p-4 shadow hover:shadow-lg transition ${
                    item.status === "Scrap" ? "bg-red-50 border-red-300" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">S/N: {item.serialNumber}</p>
                  <p className="text-sm text-gray-600">Category: {item.category}</p>
                  <p className="text-sm text-gray-600">Location: {item.location}</p>
                  <p className="text-sm text-gray-600">Department: {item.department}</p>
                  {item.assignedTeam && (
                    <p className="text-sm text-gray-600">Team: {item.assignedTeam.name}</p>
                  )}

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => handleViewMaintenance(item._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      title="View maintenance requests"
                    >
                      🔧 Maintenance
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    {item.status === "Active" && (
                      <button
                        onClick={() => handleMarkAsScrap(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Scrap
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Equipment;
