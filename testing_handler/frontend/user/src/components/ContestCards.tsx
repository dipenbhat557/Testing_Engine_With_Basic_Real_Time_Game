import { useNavigate } from "react-router-dom";

export default function ContestCards({ title, thumbnailUrl, envs, id }: { title: string; thumbnailUrl: string; envs: string[], id:string }) {
  const navigate = useNavigate()
  return (
      <div onClick={()=>navigate(`/projects/${id}`)} className="w-[45%] h-full rounded-3xl overflow-hidden cursor-pointer">
          <div className="w-full h-[70%]">
              <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="text-white p-4 flex flex-col items-center justify-center gap-2">
              <h1 className="font-bold">{title}</h1>
              <p className="font-extralight text-[10px]">ENVs req: {envs.join(", ")}</p>
          </div>
      </div>
  );
}
