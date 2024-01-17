import FlapDesignCard from "/images/FLap_Card_Design.png";

function CardsDesign() {
  return (
    <div>
      <img src={FlapDesignCard} alt="" className="w-[300px]" />
    <div className="flex justify-between pt-2">
        <p className="font-semibold md:text-xl">Basic</p>
        <button className="bg-gray-300 px-2 py-1 text-xs rounded-md uppercase font-bold text-gray-700">Order Now</button>
    </div>
    <p className="md:text-sm text-[0.80rem]">Rs. 1499</p>
    </div>
  );
}

export default CardsDesign;