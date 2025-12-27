import { useEffect, useState } from "react";
import { getAllRequests } from "../../services/request.service";
import RequestCard from "../../components/cards/RequestCard";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllRequests();
      setRequests(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requests.map((req) => (
          <RequestCard key={req._id} request={req} />
        ))}
      </div>
    </div>
  );
};

export default Requests;
