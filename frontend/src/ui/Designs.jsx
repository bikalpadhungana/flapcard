import CardsDesign from "./CardsDesign";

function Designs() {
  return (
    <div className="py-10">
      <h2 className="text-center font-['Montserrat'] text-[#121838] text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] font-semibold">
        Our <span className="text-[#143385]">Designs</span>
      </h2>

      <p className="text-center mx-auto font-semibold pt-2 pb-12 sm:w-[550px] font-['Varta'] text-[0.9rem] sm:text-[1.1rem]">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s,
      </p>

      <div className="flex flex-wrap gap-[35px] lg:justify-between justify-evenly">
        <CardsDesign />
        <CardsDesign />
        <CardsDesign />
        <CardsDesign />
        <CardsDesign />
        <CardsDesign />
      </div>
    </div>
  );
}

export default Designs;