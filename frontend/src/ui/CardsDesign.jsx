import React from 'react';

function CardsDesign({ type, desc, img, price }) {
  return (
    <div className="flex flex-col items-center">
      <img src={img} alt="" className="w-[300px] mb-3" />
      <div className="text-center">
        <p className="font-semibold md:text-xl">{type}</p>
        <p className="text-[0.80rem] md:text-sm">{desc}</p>
      </div>
      <div className="flex justify-between items-center mt-2 w-full px-4">
        <button
          onClick={() => {window.location.href="https://www.instagram.com/flap.card"}}
          className="bg-[#1c73ba] text-white py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba]"
        >
          Order Now
        </button>
        <p className="text-gray-700 font-semibold">{price}</p>
      </div>
    </div>
  );
}

export default CardsDesign;
