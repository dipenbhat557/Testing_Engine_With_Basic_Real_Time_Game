import { useState } from "react";
import { hero } from "../assets";

const cardsData = [
  {
    id: 1,
    title: "Probo Clone",
    timeLeft: "2 Days - 12 hr - 60 mins",
    img: hero,
  },
  {
    id: 2,
    title: "Quiz App",
    timeLeft: "1 Day - 5 hr - 30 mins",
    img: hero,
  },
  {
    id: 2,
    title: "Probo Clone",
    timeLeft: "2 Days - 12 hr - 60 mins",
    img: hero,
  },
  {
    id: 3,
    title: "Probo Clone",
    timeLeft: "2 Days - 12 hr - 60 mins",
    img: hero,
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < cardsData.length - 2) {
      setCurrentIndex((prev) => prev + 2);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 2);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Left Button */}
      <button
        className="p-3 bg-blue-500 text-white rounded-full mr-2 hover:bg-blue-600"
        onClick={prevSlide}
      >
        &#8592;
      </button>

      <div className="overflow-hidden w-96">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}
        >
          {cardsData.map((e) => (
            <>
              <div
                key={e.id}
                className="  z-40 rounded-3xl overflow-hidden cursor-pointer"
              >
                <div>
                  <img src={e.img} alt="" className="w-[900px]" />
                </div>
                <div className="bg-[#1A1A1A] text-white p-4">
                  <h1 className="font-bold">{e.img}</h1>
                  <p className="font-extralight text-[10px]">{e.timeLeft}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>

      <button
        className="p-3 bg-blue-500 text-white rounded-full ml-2 hover:bg-blue-600"
        onClick={nextSlide}
      >
        &#8594;
      </button>
    </div>
  );
};

export default Slider;