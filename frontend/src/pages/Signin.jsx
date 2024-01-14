import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/google.auth";

// user hooks
import { useAuthContext } from "../hooks/use.auth.context";

// components
import Navbar from "../ui/Navbar";

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
      sessionStorage.setItem('user', JSON.stringify(resData.restUserInfo));
      sessionStorage.setItem('access_token', JSON.stringify(resData.token));
      sessionStorage.setItem('refresh_token', JSON.stringify(resData.refreshToken));

      navigate('/profile');

    } catch (error) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: error });
    }
  }

  return (
    <div>
      <Navbar />
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type='text' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={(e) => {setEmail(e.target.value)}} />
          <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={(e) => {setPassword(e.target.value)}} />
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>
          <OAuth></OAuth>
        </form>

        <div className='flex gap-2 mt-5'>
          <p>Dont Have an accout?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>

        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  )
}
