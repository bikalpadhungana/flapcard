import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import validator from "validator";
import OAuth from "../components/google.auth";

// user hooks
import { useAuthContext } from "../hooks/use.auth.context";
import useUserCardContext from "../hooks/use.user.card.context";

// components 
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState("");

  const { loading, error, dispatch } = useAuthContext();
  const { data } = useUserCardContext();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetched data:", data);
    if (data) {
      setUsername(data.username);
      setEmail(data.email);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: 'SIGN_IN_START' });

    if (!username || !email || !password) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: 'All fields are required' });
      return;
    }

    if (!validator.isEmail(email)) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: 'Enter a valid email' });
      return;
    }

    if (!validator.isStrongPassword(password)) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: 'Enter a strong password' });
      return;
    }

    try {
      const res = await fetch('https://backend.flaap.me/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
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
    <div className="h-screen flex flex-col justify-between">
      <Navbar />
      <div className='p-3 px-9 max-w-lg mx-auto w-full pt-16'>
        <h1 className='sm:text-3xl text-2xl text-left font-semibold my-7'>Create a new Account</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-sm sm:text-base'>
          <input type='text' placeholder='Username' defaultValue={username} className='outline-none border border-slate-400 py-2 md:py-3 px-3 rounded-lg' id='username' onChange={(e) => {setUsername(e.target.value)}} />
          <input type='text' placeholder='Email' defaultValue={email} className='outline-none border border-slate-400 rounded-lg py-2 md:py-3 px-3 ' id='email' onChange={(e) => { setEmail(e.target.value) }} />
          <div className="flex items-center justify-center border border-slate-400 rounded-lg"> 
            <input type='password' placeholder='Password' className='outline-none w-[100%] py-2 md:py-3 px-3 rounded-lg' id='password' onChange={(e) => { setPassword(e.target.value) }} />
            <i onClick={toggleViewPassword} className="bi bi-eye-slash mr-[10px] cursor-pointer" id="togglePassword"></i>
          </div>
          <button disabled={loading} className='bg-[#1c73ba] text-white py-2 md:py-3 px-3 rounded-lg hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign up'}</button>
          <OAuth></OAuth>
        </form>

        <div className='flex gap-2 mt-5'>
          <p>Already have an account?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>
        <div className="flex gap-2 mt-5">
  <a href={`https://www.flaap.me/privacypolicy`} target="_blank" rel="noopener noreferrer">
    <h11 className="text-red-700 cursor-pointer">Read Our Privacy Policy</h11>
  </a>
</div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
      <div className="mt-auto">
        <Footer/>
      </div>
    </div>
  )
}