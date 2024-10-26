import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface TestResult{
    id:string;
    username:string;
    testId:string;
    success:boolean;
    timeTaken:string;
}

const TestResultsPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [message, setMessage] = useState("");

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/test/results`);
      console.log("result is ",response)
      setResults(response.data.data);
    } catch (error) {
      setMessage("Failed to fetch test results.");
      console.error("Error fetching test results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="flex flex-col justify-between w-full h-screen">
      <Navbar showAdmin={false} />
      <div className="flex flex-col items-center w-[80%] mx-auto p-5">
        <h2 className="font-bold text-[35px]">Test Results</h2>
        {message && <p>{message}</p>}
        {
            results?.length > 0 ? (<table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300">Username</th>
                    <th className="border border-gray-300">Test ID</th>
                    <th className="border border-gray-300">Success</th>
                    <th className="border border-gray-300">Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.map((result) => (
                    <tr key={result.id}>
                      <td className="border border-gray-300">{result.username}</td>
                      <td className="border border-gray-300">{result.testId}</td>
                      <td className="border border-gray-300">{result.success ? "Yes" : "No"}</td>
                      <td className="border border-gray-300">{JSON.stringify(result.timeTaken)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>):(<p>No Test Submissions Yet</p>)
        }
      </div>
      <Footer />
    </div>
  );
};

export default TestResultsPage;
