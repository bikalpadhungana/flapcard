import { useForm } from "react-hook-form";


function CustomDesignQueryForm() {
  const {register,handleSubmit, reset} = useForm();
  const onSubmit = (data) => {
    console.log(data)
  };  

  const handleCancel = (e) => {
    reset();
  };
  return (
    <form className="flex gap-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5  py-1 w-full">
        <div className="flex flex-col gap-1 text-xs sm:text-sm">
          <label htmlFor="fullName" className="font-semibold">Full Name :</label>
          <input
            type="text"
            id="fullName"
            placeholder="Flap Card"
            className="px-2 py-1 rounded-md"
            {...register("fullName")}
          />
        </div>
        <div className="flex flex-col gap-1 sm:text-sm text-xs">
          <label htmlFor="phoneNumber" className="font-semibold">Phone Number :</label>
          <input
            type="number"
            id="phoneNumber"
            placeholder="+977 9802365432"
            className="px-2 py-1 rounded-md"
            {...register("phoneNumber")}
          />
        </div>
        <div className="flex flex-col gap-1 sm:text-sm text-xs">
          <label htmlFor="email" className="font-semibold">Email :</label>
          <input
            type="text"
            id="email"
            placeholder="card@flap.com.np"
            className="px-2 py-1 rounded-md"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1 sm:text-sm text-xs">
          <label htmlFor="requirements" className="font-semibold">Requirements  :</label>
          <textarea
            type="teaxarea"
            id="requirements"
            placeholder="red card with a specific logo"
            className="px-2 py-1 rounded-md resize-none"
            cols="20"
            rows="4"
            maxLength="400"
            {...register("requirements")}

          />
        </div>
        <div className="flex items-centers  gap-5 text-xs sm:text-sm">
            <label htmlFor="image" className="font-semibold">Image&nbsp;: </label>
            <input type="file" className="text-xs" {...register("image")}/>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-800 px-4 py-1 rounded-md text-white text-sm hover:opacity-90 ease-in-out duration-200"
            type="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#1c73ba] text-white px-4 py-1 rounded-md text-sm hover:opacity-90 ease-in-out duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

export default CustomDesignQueryForm;