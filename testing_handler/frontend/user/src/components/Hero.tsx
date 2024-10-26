// import { useEffect, useState } from 'react';
// import { logo } from '../assets';
// import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
// import { Project } from '../pages/ProjectListPage';

// const Hero = () => {

//     const [currentProjects, setCurrentProjects] = useState<Project[]>([])

//     const updateCurrentEvents = () => {
//         let startIndex = currentIndex;
//         let endIndex = startIndex + (window.innerWidth < 640 ? 1 : 2);
//         let nextIndex =
//           endIndex % pressElements?.length == undefined
//             ? endIndex
//             : endIndex % pressElements?.length;
//         // console.log("next index is ", nextIndex, " and end is ", endIndex);
//         if (endIndex > pressElements?.length - 1) {
//           setCurrentEvents(
//             pressElements
//               ?.slice(startIndex, endIndex)
//               .concat(pressElements.slice(0, nextIndex))
//           );
//         } else {
//           setCurrentEvents(pressElements?.slice(startIndex, endIndex));
//         }
//       };

//       useEffect(()=>{
        
//       },[])

//   return (
//   <>
//     <div className="bg-black text-white min-h-[700px] flex flex-col items-center justify-center">
//       {/* Navigation Bar */}
//       <div className="w-full flex justify-between fixed top-0 items-center px-8 py-4 " >
//         <img src={logo} alt='logo' className='w-[200px] h-[50px] object-cover bg-transparent' />
//         <div className="flex space-x-4">
//           <a href="#" className="hover:underline">SignIn</a>
//           <span>|</span>
//           <a href="#" className="hover:underline">Register</a>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="text-center w-full flex flex-col justify-center items-center h-[600px]"  style={{ backgroundImage: "url(`${hero}`)" }} >
//         <h1 className="text-5xl font-bold">100x Devs Playground</h1>
//         <p className="mt-4 text-gray-400 text-lg w-[60%]">
//           "Welcome, future 100x developers! Learn by doing with real projects, sharpen your skills, and
//           build hands-on experience. Let's code, create, and grow together!"
//         </p>
//       </div>

//       {/* Project Carousel */}
//       <div className="relative w-full max-w-6xl flex items-center justify-center px-8">
//         {/* Left Arrow */}
//         <button className="absolute left-0 bg-gray-800 p-2 rounded-full hover:bg-gray-600">
//           <AiOutlineLeft className='bg-transparent text-3xl animate-pulse'/>
//         </button>
        
//         {/* Project Cards */}
//         <div className="flex space-x-6 overflow-x-auto">
//           <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-64 h-48">
//             <img src="https://via.placeholder.com/300" alt="Probo Clone" className="w-full h-32 object-cover"/>
//             <div className="p-4">
//               <h2 className="text-xl font-bold">Probo clone</h2>
//               <p className="text-gray-400 text-sm">Time left: 2 Days - 12 hr - 60 mins</p>
//             </div>
//           </div>
//           <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-64 h-48">
//             <img src="https://via.placeholder.com/300" alt="Zoom Clone" className="w-full h-32 object-cover"/>
//             <div className="p-4">
//               <h2 className="text-xl font-bold">Zoom clone</h2>
//               <p className="text-gray-400 text-sm">Time left: 2 Days - 12 hr - 60 mins</p>
//             </div>
//           </div>
//           {/* Add more cards here as needed */}
//         </div>

//         {/* Right Arrow */}
//         <button className="absolute left-0 bg-gray-800 p-2 rounded-full hover:bg-gray-600">
//           <AiOutlineRight className='bg-transparent text-3xl animate-pulse'/>
//         </button>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Hero;

import { SlArrowLeft } from "react-icons/sl";

("use client");
import { motion } from "framer-motion";
import { Herohighlight, Highlight } from "./Herohighlight";

export default function Hero() {
  return (
    <>
      <Herohighlight>
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
          className="text-2xl px-4 md:text-4xl lg:text-[50px] mb-48 font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          100x Devs Playground <br />
          <Highlight className="text-white">
            Gain hands-on experience, and grow with us!
          </Highlight>
        </motion.h1>
      </Herohighlight>
      <div>
        <SlArrowLeft className="text-white text-4xl" />
      </div>
    </>
  );
}