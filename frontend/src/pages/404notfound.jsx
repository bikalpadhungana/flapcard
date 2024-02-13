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
            <Link to="/">
                <button className="py-2 px-5 text-white text-sm bg-card-color-6 border-2 border-brand_1 ">
                    BACK TO HOMEPAGE
                </button>
            </Link>
        </div>
        </>
    )
}