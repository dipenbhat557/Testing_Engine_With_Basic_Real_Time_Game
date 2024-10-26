import { logo } from "../assets";

export default function Navbar() {
  return (
    <>
      <div className="bg-[#000000] flex mx-auto justify-between items-center w-[96%]">
        <img src={logo} className="w-30 h-14 pl-6" alt="" />
        <div className="cursor-pointer text-slate-300 font-light ">Are you an admin?</div>
      </div>
    </>
  );
}