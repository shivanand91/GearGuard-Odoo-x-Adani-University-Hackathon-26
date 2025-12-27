import { FiTool, FiMapPin } from "react-icons/fi";

const EquipmentCard = ({ equipment, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{equipment.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            equipment.status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {equipment.status}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <FiTool /> {equipment.category}
        </p>
        <p className="flex items-center gap-2">
          <FiMapPin /> {equipment.location}
        </p>
      </div>
    </div>
  );
};

export default EquipmentCard;
