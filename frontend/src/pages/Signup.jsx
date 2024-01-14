import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import validator from "validator";
import OAuth from "../components/google.auth";

// user hooks
import { useAuthContext } from "../hooks/use.auth.context";
import useUserCardContext from "../hooks/use.user.card.context";

// components 
import Navbar from "../ui/Navbar";

export default function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState("");

  const { loading, error, dispatch } = useAuthContext();
  const { data } = useUserCardContext();

  const navigate = useNavigate();

  useEffect(() => {
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
      const res = await fetch('https://backend-flap.esainnovation.com/api/auth/signup', {
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
      sessionStorage.setItem('user', JSON.stringify(resData.restUserInfo));
      sessionStorage.setItem('access_token', JSON.stringify(resData.token));
      sessionStorage.setItem('refresh_token', JSON.stringify(resData.refreshToken));
      
      navigate('/home');

    } catch (error) {
      dispatch({ type: 'SIGN_IN_FAILURE', payload: error });
    }
  }

  return (
    <div>
      <Navbar />
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type='text' placeholder='Username' defaultValue={username} className='border p-3 rounded-lg' id='username' onChange={(e) => {setUsername(e.target.value)}} />
          <input type='text' placeholder='Email' defaultValue={email} className='border p-3 rounded-lg' id='email' onChange={(e) => {setEmail(e.target.value)}} />
          <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={(e) => {setPassword(e.target.value)}} />
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign Up'}</button>
          <OAuth></OAuth>
        </form>

        <div className='flex gap-2 mt-5'>
          <p>Have an accout?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>

        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  )
}
