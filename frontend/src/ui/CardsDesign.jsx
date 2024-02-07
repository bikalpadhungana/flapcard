

function CardsDesign({type,desc,img}) {
  return (
    <div>
      <img src={img} alt="" className="w-[300px]" />
    <div className="flex justify-between pt-2">
        <p className="font-semibold md:text-xl">{type}</p>
        <button onClick={() => {window.location.href="https://www.instagram.com/flapcardnepal"}} className="bg-gray-300 px-2 py-1 text-xs rounded-md uppercase font-bold text-gray-700">Order Now</button>
    </div>
    <p className="text-[0.80rem] w-[220px] md:text-sm">{desc}</p>
    </div>
  );
}

export default CardsDesign;