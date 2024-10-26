import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const TestUploadPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [notionLink, setNotionLink] = useState("");
  const [envs, setEnvs] = useState("");
  const [testFile, setTestFile] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setMessage("Unauthorized access. Please sign in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("notionLink", notionLink);
    formData.append("envs", envs);
    formData.append("username", "ADMIN");
    if (testFile) formData.append("testFile", testFile);
    if (thumbnailImage) formData.append("thumbnailImage", thumbnailImage);

    try {
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }
      console.log("authtoken is ",authToken)
      // console.log("datas is ",formData)
      // console.log("url is ",`${import.meta.env.VITE_API_URL}/test/register`)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/test/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage("Test registered successfully!");
      console.log("Response:", response.data);
      navigate("/tests")
    } catch (err) {
      setMessage("Failed to register test. Please try again.");
      console.error("Test registration failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-screen">
      <Navbar showAdmin={false} />
      <div className="flex flex-col items-center w-[60%] h-[70%] border mx-auto p-5 rounded-xl border-opacity-30 border-slate-400 justify-center gap-5 ">
        <h2 className="font-bold text-[35px]">Register New Test</h2>
        {message && <p className={`${message == "Test registered successfully!"?"text-green-400":"text-red-400"}`}>{message}</p>}
        <form
          className="flex flex-col items-center w-full h-full justify-center gap-5 "
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4">
            <label className="font-medium text-[20px]">Title:</label>

            <input
              className="px-4 py-2 box-border-slate-500 border-opacity-50 box-border"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <label className="font-medium text-[20px]">Notion Link:</label>

            <input
              className="px-4 py-2"
              type="url"
              value={notionLink}
              onChange={(e) => setNotionLink(e.target.value)}
              required
              placeholder="https://www.notion.so/....."
            />
          </div>
          <div className="flex gap-4 flex-col">
            <label className="font-medium text-[20px]">
              Environment Variables (String Array):
            </label>

            <textarea
              className="px-4 py-2"
              value={envs}
              onChange={(e) => setEnvs(e.target.value)}
              required
              placeholder='["ENV1","ENV2",...]'
            ></textarea>
          </div>
          <div className="flex gap-4">
            <label className="font-medium text-[20px]">Test File:</label>
            <input
              className="px-4 py-2"
              type="file"
              accept=".js"
              onChange={(e) => handleFileChange(e, setTestFile)}
              required
            />
          </div>
          <div className="flex gap-4">
            <label className="font-medium text-[20px]">Thumbnail Image: </label>
            <input
              className="px-4 py-2"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setThumbnailImage)}
            />
          </div>
          <button type="submit" className="rounded-xl bg-blue-500 bg-opacity-50 px-10 py-1">Submit Test</button>
        </form>
        
      </div>
      <Footer />
    </div>
  );
};

export default TestUploadPage;
