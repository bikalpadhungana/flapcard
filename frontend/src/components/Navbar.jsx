import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/use.auth.context";

export default function Navbar() {

  const { user } = useAuthContext();

  return (
    <header className="bg-green-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        <Link to="/home">
          <h1 className="font-bold text-sm sm:text-3xl text-navbar">SAV</h1>
        </Link>

        {!user &&
          <ul className="flex gap-4">
            <Link to="/sign-in">
              <li className="text-black bg-navbar hover:opacity-75 transition-all duration-500 cursor-pointer border-4 rounded-full border-navbar p-2 w-24 text-center">Sign in</li>
            </Link>
            <Link to="/sign-up">
              <li className="text-black bg-navbar hover:opacity-75 transition-all duration-500 cursor-pointer border-4 rounded-full border-navbar p-2 w-24 text-center">Sign up</li>
            </Link>
          </ul>}
          
        {user &&
          <ul>
            <Link to="profile">
              <li className="text-black bg-navbar hover:opacity-75 transition-all duration-500 cursor-pointer border-4 rounded-full border-navbar p-2 w-24 text-center">Profile</li>
            </Link>
          </ul>  
        }
        
      </div>
    </header>
  )
}
