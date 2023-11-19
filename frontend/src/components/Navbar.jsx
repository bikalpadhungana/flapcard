import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-green-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-3xl text-green-700">SAV</h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/sign-in">
            <li className="text-black bg-green-400 hover:underline cursor-pointer border-4 rounded-full border-green-400 p-2 w-24 text-center">Sign in</li>
          </Link>
          <Link to="/">
            <li className="text-black bg-green-400 hover:underline cursor-pointer border-4 rounded-full border-green-400 p-2 w-24 text-center">Sign up</li>
          </Link>
        </ul>
      </div>
    </header>
  )
}
