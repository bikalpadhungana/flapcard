import Navbar from "../ui/Navbar";
// import flapCard from "../../images/flap-card.png";

export default function CreateCard() {
  return (
      <div>
          <Navbar />
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 max-w-full mx-auto">
              <div className="flex flex-col">  
                <div className="max-w-3xl my-8 mx-5 border-2 border-navbar rounded-xl">
                    {/* <img src={flapCard}></img> */}
                </div>
                <div className="flex max-w-xs md:max-w-3xl mx-auto">
                    <div className="w-10 md:w-20 h-10 md:ml-10 bg-card-color-1"></div>
                    <div className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-2"></div>
                    <div className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-3"></div>
                    <div className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-4"></div>
                    <div className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-5"></div>
                    <div className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-6"></div>
                    <div className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-7"></div>
                </div>
              </div>
              <div className="max-w-3xl mx-auto mb-5 md:ml-10 md:my-auto p-10 border-2 border-navbar rounded-xl">
                  <form className="flex flex-col gap-5">
                    <input type='text' placeholder='Username' className='w-60 md:w-96 border p-3 rounded-lg' id='username' />
                    <input type='text' placeholder='Email' className='w-60 md:w-96 border p-3 rounded-lg' id='email' />
                    <input type='number' placeholder='Phone number' className='w-60 md:w-96 border p-3 rounded-lg' id='phone_number' />
                    <input type='text' placeholder='Organization' className='w-60 md:w-96 border p-3 rounded-lg' id='organization' />
                    <input type='password' placeholder='Password' className='w-60 md:w-96 border p-3 rounded-lg' id='password' />
                    <button className='bg-navbar text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create</button>
                  </form>
              </div>
          </div>
    </div>
  )
}