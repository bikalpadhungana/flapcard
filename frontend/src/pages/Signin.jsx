import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/google.auth";

// user hooks
import { useAuthContext } from "../hooks/use.auth.context";

// components
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function Signin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, dispatch } = useAuthContext();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: 'SIGN_IN_START' });

    if (!email || !password) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: 'All fields are required' });
      return;
    }

    try {
      const res = await fetch('https://backend-flap.esainnovation.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const resData = await res.json();

      if (resData.success === false) {
        dispatch({ type: 'SIGN_IN_FAILURE', payload: resData.message });
        return;
      }

      dispatch({ type: 'SIGN_IN_SUCCESS', payload: resData.restUserInfo });
      localStorage.setItem('user', JSON.stringify(resData.restUserInfo));
      localStorage.setItem('access_token', JSON.stringify(resData.token));
      localStorage.setItem('refresh_token', JSON.stringify(resData.refreshToken));

      navigate('/profile');

    } catch (error) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: error });
    }
  }

  const toggleViewPassword = (e) => {
    const passwordField = document.getElementById('password');

    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    if (type === "text") {
      e.target.classList.add("bi-eye");
      e.target.classList.remove("bi-eye-slash");
    }
    if (type === "password") {
      e.target.classList.add("bi-eye-slash");
      e.target.classList.remove("bi-eye");
    }
  }

  return (
    <div className="h-screen flex flex-col ">
      <Navbar />
      <div className="p-3 px-9 max-w-lg mx-auto pt-16 w-full">
        <h1 className="md:text-3xl text-2xl text-left font-semibold my-7">
          Welcome back to Flap!
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm sm:text-base">
          <input
            type="text"
            placeholder="Email"
            className="outline-none border border-slate-400 py-2 sm:py-3 px-3 rounded-lg"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <div className="flex items-center justify-center border border-slate-400 rounded-lg"> 
            <input type='password' placeholder='Password' className='outline-none w-[100%] py-2 md:py-3 px-3 rounded-lg' id='password' onChange={(e) => { setPassword(e.target.value) }} />
            <i onClick={toggleViewPassword} className="bi bi-eye-slash mr-[10px] cursor-pointer" id="togglePassword"></i>
          </div>
          <button
            disabled={loading}
            className="bg-[#1c73ba] text-white  py-2 sm:py-3 px-3 rounded-lg  hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <OAuth></OAuth>
        </form>

        <div className="flex gap-2 mt-5">
          <p>Don't have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>

        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
