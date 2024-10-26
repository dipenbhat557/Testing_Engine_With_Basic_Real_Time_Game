import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Test {
  id: string;
  title: string;
  notionLink: string;
  thumbnailUrl: string;
  username: string;
  testFileUrl: string;
}

const TestsListPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]); // Initialize as an empty array
  const [message, setMessage] = useState("");

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tests`);
      console.log("response is ",response)
      if (Array.isArray(response.data.data)) {
        setTests(response.data.data);
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
    <div className="flex flex-col justify-between w-full h-screen">
      <Navbar showAdmin={false} />
      <div className="flex flex-col items-center w-[80%] mx-auto p-5">
        <h2 className="font-bold text-[35px]">Tests List</h2>
        {message && <p>{message}</p>}
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2">Title</th>
              <th className="border border-gray-300 px-2">Notion Link</th>
              <th className="border border-gray-300 px-2">Thumbnail</th>
              <th className="border border-gray-300 px-2">Username</th>
              <th className="border border-gray-300 px-2">Test File</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test: Test) => (
              <tr key={test.id}>
                <td className="border border-gray-300 px-2">{test.title}</td>
                <td className="border border-gray-300 px-2">
                  <a href={test.notionLink} target="_blank" rel="noopener noreferrer">
                    {test.notionLink}
                  </a>
                </td>
                <td className="border border-gray-300 px-2">
                  {test.thumbnailUrl && (
                    <img src={test.thumbnailUrl} alt="Thumbnail" className="h-16 w-16" />
                  )}
                </td>
                <td className="border border-gray-300 px-2">{test.username}</td>
                <td className="border border-gray-300 px-2">{test.testFileUrl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default TestsListPage;
