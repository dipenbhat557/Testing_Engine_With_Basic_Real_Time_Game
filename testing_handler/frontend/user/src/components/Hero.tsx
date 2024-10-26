"use client";
import { motion } from "framer-motion";
import { Herohighlight, Highlight } from "./Herohighlight";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ContestCards from "./ContestCards";
import { useEffect, useState } from "react";
import axios from "axios"
import { Project } from "../pages/ProjectDetailPage";

export default function Hero() {
  const [contests, setContests] = useState<Project[]>([]);
  const [startIndex, setStartIndex] = useState(0); 

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tests`);
      if (Array.isArray(response.data.data)) {
        setContests(response.data.data);
      } 
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleNext = () => {
    if (startIndex + 1 < contests.length-1) {
      setStartIndex((startIndex + 1)%contests.length);
    }
  };

  const handlePrev = () => {
    if (startIndex - 1 >= 0) {
      setStartIndex((startIndex - 1)%contests.length);
    }
  };

  return (
    <div className="relative flex h-[700px] items-center flex-col w-full">
      <Herohighlight className="bg-transparent">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 flex flex-col gap-1 items-center md:text-4xl lg:text-[50px] mb-48 font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          100x Devs Playground <br />
          <Highlight className="text-white">Gain hands-on experience, and</Highlight>
          <Highlight className="text-white">grow with us!</Highlight>
        </motion.h1>
      </Herohighlight>

      <div className="h-[300px] absolute -bottom-20 z-4 w-[70%] mx-auto flex justify-around items-center">
        <FaAngleLeft onClick={handlePrev} className="text-[50px] bg-transparent animate-pulse cursor-pointer" />
        <div className="flex items-center justify-between gap-4 h-full w-[70%]">
          {contests.slice(startIndex, startIndex + 2).map((contest:Project, id) => (
            <ContestCards key={id} id={contest.id} title={contest.title} thumbnailUrl={contest.thumbnailUrl} envs={contest.envs}/>
          ))}
        </div>
        <FaAngleRight onClick={handleNext} className="text-[50px] bg-transparent animate-pulse cursor-pointer" />
      </div>
    </div>
  );
}
