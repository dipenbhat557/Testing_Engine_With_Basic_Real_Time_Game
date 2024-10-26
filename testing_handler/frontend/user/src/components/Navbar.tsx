import { logo } from "../assets";

export default function Navbar() {
  return (
    <>
      <div className="bg-[#000000]">
        <img src={logo} className="w-30 h-14 pl-6" alt="" />
        <div></div>
      </div>
    </>
  );
}