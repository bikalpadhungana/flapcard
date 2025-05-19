import Navbar from "../ui/Navbar";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
      <>
        <Navbar />
        <div className="flex self-center justify-center">
            <img src="./images/404notfound.jpg"  height={500} width={500}/>
        </div>
        <div className="flex self-center justify-center">
            <Link to="/profile">
            <button className="py-2 px-5 text-white text-sm bg-[#1c73ba] border-2 border-brand_1">
                    GO TO PROFILE
                </button>
            </Link>
        </div>
        </>
    )
}
