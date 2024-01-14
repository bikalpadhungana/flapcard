function About() {
  return (
    <div className="flex lg:flex-row flex-col items-center font-['Montserrat'] gap-9 mb-5">
      <div className="lg:order-1 order-2 relative flex">
        <img
          src="../../images/flapPhone.png"
          alt=""
          className="z-10 w-[400px]"
        />
        <img
          src="../../images/blob1.png"
          className="z-0 absolute top-20 sm:w-[650px] sm:h-[450px]"
          alt=""
        />
      </div>

      <div className="lg:order-2 order-1 lg:pt-0 pt-[100px] lg:w-[700px]">
        <h2 className="pb-3 text-center lg:text-left text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-[#232946]">
          What is <span className="text-[#143385]">Flap?</span>
        </h2>
        <p className="lg:mx-0 sm:mx-12 sm:text-[1.1rem] text-[1rem] text-center lg:text-left lg:px-0 md:px-9 sm:leading-7 leading-6 font-['Varta'] font-semibold">
          Flap represents an advanced networking solution that leverages
          NFC-enabled digital business cards to redefine connectivity standards.
          Offered by esa innovation, these cards transcend traditional
          paper-based methods by effortlessly exchanging contact details,
          sharing links, etc. all through a simple touch on your smartphone.
          With cutting-edge edge-to-edge printing and versatile functionalities,
          Flap aims to set new benchmarks in networking efficiency within the
          contemporary digital landscape.
        </p>
      </div>
    </div>
  );
}

export default About;