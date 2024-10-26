import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("username is ",username," password is ",password)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/signin`, {
        username,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("authToken", token);

      navigate("/test-upload");
    } catch (err) {
      setError("Invalid username or password.");
      console.error("Sign-in failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-screen">
        <Navbar showAdmin={false}/>
      <div className="flex flex-col items-center w-[60%] h-[40%] border mx-auto p-5 rounded-xl border-opacity-30 border-slate-400 justify-center gap-5 ">
        <h2 className="font-bold text-[35px]">Admin Sign-In</h2>
      <form onSubmit={handleSignIn} className="flex flex-col items-center w-full h-full justify-center gap-5 ">
        <div className="flex gap-4"><label  className="font-medium text-[20px]">
          Username:
        </label >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="px-4 py-2"
          /></div>
        <div className="flex gap-4">
            <label className="font-medium text-[20px]">
          Password:
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2"
          /></div>
          
        <button type="submit" className="rounded-xl bg-blue-500 bg-opacity-50 px-10 py-1">Sign In</button>
      </form>
      {error && <p>{error}</p>}</div>
      <Footer/>
    </div>
  );
};

export default SignInPage;
