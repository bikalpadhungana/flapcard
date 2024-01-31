import { Link } from "react-router-dom";

function Main() {

  function handleOrder() {
    window.location.href = "https://flap.esainnovation.com/place-order";
  }
  
  return (
    <div className="bg-[#E9ECF2] lg:mb-9">
      <div className="max-w-[1150px] mx-auto px-5">
      <div className="flex justify-between lg:flex-row flex-col py-9 md:pt-[60px] sm:pt-12 pt-9 gap-[60px] ">
        <div>
          <h1
            className=" text-[rgb(18,24,56)] lg:text-left text-center lg:w-[200px] lg:mx-[0px] md:mx-[100px] sm:font-[700] font-[600] sm:pb-10 pb-8 pt-9 tracking-wide leading-[55px] sm:leading-normal text-[clamp(2.2rem,6.8vw+1rem,4.5rem)]"
            style={{
              fontFamily: "Montserrat"
            }}
          >
            Tap. Connect. Thrive
          </h1>
          <div className="flex gap-9 justify-center">
            <button onClick={handleOrder} className="bg-[#143385] text-white py-2  sm:w-[180px] w-[120px] md:text-md text-xs font-semibold hover:opacity-80 duration-150 ease-in-out">
              ORDER NOW
            </button>
            <Link to="sign-up">
            <button className="bg-white hover:bg-[#14328579] duration-150 ease-in-out hover:text-white  border py-2  sm:w-[180px] w-[120px] md:text-sm text-xs border-[#143385] font-semibold text-[#143385]">
              EXPLORE
            </button>
            </Link>
          </div>
        </div>

        <div className="relative flex overflow-hidden sm:h-[480px] h-[90vw]">
          <img
            src="/images/landing_flapcard.png"
            alt=""
            className=" z-10 relative md:w-[600px] md:h-[450px] sm:h-[400px] sm:w-[550px] w-[95vw] h-[80vw] mx-auto"
          />
          <img
            src="/images/ellipse.png"
            alt=""
            className="absolute md:top-0 z-0 md:right-0 md:w-[480px] w-[420px] lg:left-[115px] lg:mx-1 mx-auto left-0 right-0" 
          />
          
          <img
            src="/images/hollowEllipse.png"
            alt=""
            className="w-[140px] h-[140px] left-0 right-[45%] mx-auto top-[10px] absolute"
          />
        </div>
      </div>
      </div>
    </div>
  );
}

export default Main;