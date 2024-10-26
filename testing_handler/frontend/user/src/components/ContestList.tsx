import { hero } from "../assets";
import Pagination from "./Pagination";

export default function ContestList() {
  const contests = [
    {
      id: 1,
      title: "Probo Clone",
      timeLeft: "2 Days - 12 hr - 60 mins",
      img: hero,
      type: "Expert",
    },
    {
      id: 2,
      title: "Quiz App",
      timeLeft: "1 Day - 5 hr - 30 mins",
      img: hero,
      type: "Intermediate",
    },
    {
      id: 3,
      title: "WebRTC",
      timeLeft: "2 Days - 12 hr - 60 mins",
      img: hero,
      type: "Expert",
    },
    {
      id: 4,
      title: "Messaging App",
      timeLeft: "2 Days - 12 hr - 60 mins",
      img: hero,
      type: "Expert",
    },
  ];

  return (
    <div className="w-[80%] mx-auto p-7 rounded-xl h-auto">
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr>
            <th className="text-white px-4 py-2">Image</th>
            <th className="text-white px-4 py-2">Title</th>
            <th className="text-white px-4 py-2">Time Left</th>
            <th className="text-white px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest.id} className="bg-[#282828] rounded-xl">
              <td className="px-4 py-2">
                <img
                  src={contest.img}
                  alt={contest.title}
                  className="w-[120px] h-[80px] object-cover rounded-lg"
                />
              </td>
              <td className="text-white px-4 py-2">{contest.title}</td>
              <td className="text-white px-4 py-2">{contest.timeLeft}</td>
              <td className="px-4 py-2">
                <span className="bg-[#444] text-white py-1 px-3 rounded-lg">
                  {contest.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={1} totalPages={2} onPageChange={()=>console.log("page changed")}/>
    </div>
  );
}
