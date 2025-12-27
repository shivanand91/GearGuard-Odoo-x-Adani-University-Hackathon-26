import { useEffect, useState } from "react";
import { getAllEquipment } from "../../services/equipment.service";
import { getAllRequests } from "../../services/request.service";

const Dashboard = () => {
  const [stats, setStats] = useState({
    equipment: 0,
    requests: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const equipmentData = await getAllEquipment();
        const requestData = await getAllRequests();

        const equipmentList = equipmentData?.data || [];
        const requestList = requestData?.data || [];

        setStats({
          equipment: equipmentList.length,
          requests: requestList.length,
          pending: requestList.filter(r => r.status === "New").length,
          completed: requestList.filter(r => r.status === "Repaired").length
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Equipments" value={stats.equipment} />
        <Stat title="Requests" value={stats.requests} />
        <Stat title="Pending" value={stats.pending} />
        <Stat title="Completed" value={stats.completed} />
      </div>
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white p-5 rounded shadow text-center">
    <h2 className="text-gray-500">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;
