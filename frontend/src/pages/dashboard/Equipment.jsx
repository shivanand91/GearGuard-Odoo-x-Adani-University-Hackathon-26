import { useEffect, useState } from "react";
import { getAllEquipment } from "../../services/equipment.service";
import EquipmentCard from "../../components/cards/EquipmentCard";

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEquipment();
      setEquipment(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Equipment</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {equipment.map((item) => (
          <EquipmentCard key={item._id} equipment={item} />
        ))}
      </div>
    </div>
  );
};

export default Equipment;
