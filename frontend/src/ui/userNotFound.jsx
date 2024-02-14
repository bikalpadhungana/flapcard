import Navbar from "./Navbar"
import { Link } from "react-router-dom";

export default function UserNotFound(){
    return(
        <>
        <Navbar/>
        <div className="flex flex-col justify-center self-center">
            {/* <p className="m-auto mt-10 text-[red]">USER NOT FOUND!</p> */}
        <img src="/images/404usernotfound.png" height={500} width={500} className="m-auto" ></img>
        <Link className="m-auto" to="/sign-up">  
         <button className="py-2 px-5 text-white text-sm bg-card-color-6 border-2 border-brand_1">
                   CREATE AN ACCOUNT
                </button>
        </Link>
      
        </div>
        </>
    )
}