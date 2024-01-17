import CustomDesignQueryForm from "./CustomDesignQueryForm";

function CustomDesignForm() {
  return (
    <div className="bg-[#D9D9D9] w-full border-white sm:border-[10px] border-[5px] shadow-xl lg:h-[530px] flex flex-col lg:flex-row my-12 rounded-xl">
      <div className="  lg:w-[40%] lg:border-r-white lg:border-r-[15px] lg:border-b-0 sm:border-b-[15px] border-b-[10px] border-b-white lg:h-full py-9 gap-1 flex flex-col justify-center">
        <h3 className="text-center lg:text-2xl text-lg font-semibold">
          Need Custom Designs?
        </h3>
        <p className="text-center px-5 text-[0.92rem] lg:text-[1rem]">
          Please provide us with necessary information to order your custom Flap
          Card.
        </p>
      </div>
      <div className="lg:w-[60%] py-9  flex justify-center items-center lg:px-8 sm:px-[50px] px-6">
        <CustomDesignQueryForm/>
      </div>
    </div>
  );
}

export default CustomDesignForm;