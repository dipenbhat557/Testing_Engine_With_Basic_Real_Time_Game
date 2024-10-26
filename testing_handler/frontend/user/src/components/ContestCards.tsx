export default function ContestCards({ title, timeLeft, img }:{title:any, timeLeft:any, img:any}) {
    return (
      <>
        <div className=" w-[40%] h-[400px] mt-[-200px] z-40 rounded-3xl overflow-hidden cursor-pointer">
          <div className="w-full h-[70%]">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className=" text-white p-4 flex flex-col items-center justify-center gap-2">
            <h1 className="font-bold">{title}</h1>
            <p className="font-extralight text-[10px]">{timeLeft}</p>
            <button></button>
          </div>
        </div>
      </>
    );
  }