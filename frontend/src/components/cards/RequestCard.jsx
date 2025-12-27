const statusColors = {
  New: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Repaired: "bg-green-100 text-green-700",
  Scrap: "bg-red-100 text-red-700"
};

const RequestCard = ({ request }) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-md">{request.subject}</h3>

        <span
          className={`text-xs px-2 py-1 rounded ${
            statusColors[request.status]
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Equipment:</span>{" "}
          {request.equipment?.name}
        </p>

        <p>
          <span className="font-medium">Team:</span>{" "}
          {request.team?.name}
        </p>

        <p>
          <span className="font-medium">Type:</span>{" "}
          {request.type}
        </p>
      </div>
    </div>
  );
};

export default RequestCard;
