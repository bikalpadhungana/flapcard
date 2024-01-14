function CustomDesignForm() {
  return (
    <div className="bg-[#D9D9D9] w-full border-white border-[10px] shadow-xl h-[400px] flex flex-col md:flex-row my-12">
      <div className="  md:w-[40%] md:border-r-white md:border-r-[15px] md:border-b-0 border-b-[15px] border-b-white h-full flex flex-col justify-center">
        <h3 className="text-center text-2xl font-semibold">
          Need Custom Designs?
        </h3>
        <p className="text-center px-5 text-[1rem]">
          Please proivide us with necessary information to order you custom Flap
          Card
        </p>
      </div>
      <div className="md:w-[60%] py-9 px-9"></div>
    </div>
  );
}

export default CustomDesignForm;