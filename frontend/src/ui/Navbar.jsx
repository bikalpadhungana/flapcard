import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/use.auth.context";

export default function Navbar() {

  const { user } = useAuthContext();

  if (!user) {
    return (
        <header className="bg-black py-4 h-[4.2rem] mb-[0px]">
          <div className="max-w-[1150px] mx-auto flex justify-end px-5">
            <ul className=" gap-8 text-white text-[0.9rem] items-center flex md:visible">
              <Link to='/'><li>Home</li></Link>
              {/* <li>About</li>
              <li>Contact</li> */}
              <li>||</li>
              <Link to="/sign-in"><li>Sign In</li></Link>
              <Link to="/sign-up"><li className="border rounded-md px-2 py-1">Sign Up</li></Link>
            </ul>
          </div>
        </header>
    )
  } else {
    return (
        <header className="bg-black py-4 h-[4.2rem] mb-[0px]">
          <div className="max-w-[1150px] mx-auto flex justify-end px-5">
            <ul className=" gap-8 text-white text-[0.9rem] items-center hidden md:visible md:flex">
              <Link to='/'><li>Home</li></Link>
              <li>About</li>
              <li>Contact</li>
              <li>||</li>
              {/* <Link to="/sign-in"><li>Sign In</li></Link> */}
              <Link to="/profile"><li className="border rounded-md px-2 py-1">Profile</li></Link>
            </ul>
          </div>
        </header>
    )
  }
}