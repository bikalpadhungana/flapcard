import CardsDesign from "./CardsDesign";

function Designs() {
  return (
    <div className="py-10">
      <h2 className="text-center font-['Montserrat'] text-[#121838] text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] font-semibold">
        Our <span className="text-[#143385]">Products</span>
      </h2>

      <p className="text-center mx-auto font-semibold pt-2 pb-12 sm:w-[650px] font-['Varta'] text-[0.9rem] sm:text-[1.1rem]">
      Flap: The Future of Networking at Your Fingertips. Our innovative digital business cards use NFC technology for instant contact sharing with a simple tap. Available in three distinct materials:
      </p>

      <div className="flex flex-wrap gap-[35px] lg:justify-between justify-evenly">
        <CardsDesign type="Plastic" img="/images/plasticCard.png" desc="Classic and durable, ideal for everyday use."/>
        <CardsDesign type="Wood" img="/images/woodCard.png" desc="Unique and eco-friendly, for a natural touch."/>
        <CardsDesign type="Metal" img="/images/metalCard.png" desc="Sleek and sophisticated, for a premium feel."/>
      </div>
    </div>
  );
}

export default Designs;