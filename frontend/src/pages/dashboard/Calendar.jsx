import { useState, useEffect } from "react";
import { getPreventiveRequests, createRequest } from "../../services/request.service";
import { getAllEquipment } from "../../services/equipment.service";
import { useAuth } from "../../hooks/useAuth";

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));
  const [preventiveRequests, setPreventiveRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    equipment: "",
    scheduledDate: ""
  });

  useEffect(() => {
    fetchPreventiveRequests();
    fetchEquipment();
  }, [currentDate]);

  const fetchPreventiveRequests = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const data = await getPreventiveRequests({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      setPreventiveRequests(data.data || []);
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

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setFormData({ ...formData, scheduledDate: selected.toISOString().split("T")[0] });
    setShowForm(true);
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
        type: "Preventive",
        createdBy: user.id || user._id
      });
      resetForm();
      fetchPreventiveRequests();
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
      scheduledDate: ""
    });
    setShowForm(false);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRequestsForDay = (day) => {
    return preventiveRequests.filter((req) => {
      const reqDate = new Date(req.scheduledDate);
      return reqDate.getDate() === day &&
             reqDate.getMonth() === currentDate.getMonth() &&
             reqDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Preventive Maintenance Calendar</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">Schedule Preventive Maintenance</h2>
            <p className="text-sm text-gray-600 mb-4">
              Date: {selectedDate?.toLocaleDateString()}
            </p>
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
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ← Previous
          </button>
          <h2 className="text-2xl font-bold">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next →
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayRequests = day ? getRequestsForDay(day) : [];
            return (
              <div
                key={index}
                onClick={() => day && handleDateClick(day)}
                className={`border-2 rounded-lg p-2 min-h-24 ${
                  day
                    ? "cursor-pointer hover:bg-blue-50 border-gray-300"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {day && (
                  <>
                    <div className="font-bold text-lg mb-2">{day}</div>
                    <div className="space-y-1">
                      {dayRequests.slice(0, 2).map((req) => (
                        <div
                          key={req._id}
                          className="text-xs bg-blue-200 text-blue-800 p-1 rounded truncate"
                          title={req.subject}
                        >
                          {req.subject}
                        </div>
                      ))}
                      {dayRequests.length > 2 && (
                        <div className="text-xs text-gray-600">
                          +{dayRequests.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Requests */}
      {preventiveRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Maintenance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preventiveRequests
              .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
              .slice(0, 6)
              .map((req) => (
                <div key={req._id} className="border rounded-lg p-4 bg-white shadow">
                  <p className="font-bold">{req.subject}</p>
                  <p className="text-sm text-gray-600">
                    Equipment: {equipment.find((e) => e._id === req.equipment)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Scheduled: {new Date(req.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Status: {req.status}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
