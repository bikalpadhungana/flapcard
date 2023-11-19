import { Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(username, email, password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      //add error
    }

    try {
      console.log(username);
    } catch (error) {
      console.log(error);
      //add dispatch for error
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={(e) => {setUsername(e.target.value)}} />
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={(e) => {setEmail(e.target.value)}} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={(e) => {setPassword(e.target.value)}} />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an accout?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>

      {/* {error && <p className="text-red-500 mt-5">{error}</p>} */}
    </div>
  )
}
