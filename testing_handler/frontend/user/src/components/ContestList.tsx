import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import axios from "axios";

export default function ContestList() {
  const [contests, setContests] = useState([]);
  const [message, setMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tests`);
      console.log("response is ",response)
      if (Array.isArray(response.data.data)) {
        setContests(response.data.data);
        setTotalPages(response.data.totalPages)
      } else {
        setMessage("Unexpected response format.");
      }
    } catch (error) {
      setMessage("Failed to fetch tests.");
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);


  return (
    <div className="w-[80%] mx-auto p-7 rounded-xl h-auto">
      {message && <p>{message}</p>}
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr>
            <th className="text-white px-4 py-2">Thumbnail</th>
            <th className="text-white px-4 py-2">Title</th>
            <th className="text-white px-4 py-2">Username</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest: any) => (
            <tr key={contest.id} className="bg-[#282828] rounded-xl">
              <td className="px-4 py-2">
                <img
                  src={contest.thumbnailUrl}
                  alt={contest.title}
                  className="w-[120px] h-[80px] object-cover rounded-lg"
                />
              </td>
              <td className="text-white px-4 py-2">{contest.title}</td>
              <td className="text-white px-4 py-2">{contest.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
