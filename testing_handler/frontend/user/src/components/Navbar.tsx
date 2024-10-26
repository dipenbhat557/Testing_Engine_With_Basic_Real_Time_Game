// import { logo } from "../assets";

import { useNavigate } from "react-router-dom";

export default function Navbar({showAdmin}:{showAdmin:boolean}) {
  const navigate = useNavigate()
  return (
    <>
      <div className="bg-[#000000] flex mx-auto justify-between items-center w-[96%]">
        {/* <img src={logo} className="w-30 h-14 pl-6" alt="" /> */}
        <div className={` text-[30px] p-4 text-white font-bold cursor-pointer`} onClick={()=>navigate("/")}>100xDevs</div>
        <div className={`${showAdmin ? "" : "hidden"} cursor-pointer text-slate-300 font-light`} onClick={()=>navigate("/signin")}>Are you an admin?</div>
      </div>
    </>
  );
}