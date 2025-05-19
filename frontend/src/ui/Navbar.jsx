import { Link, useNavigate } from "react-router-dom"; 
import { useAuthContext } from "../hooks/use.auth.context"; 
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import FlapLogo from "/images/flap.png";

const MenuItems = ({ user, handleSignOut }) => (
  <>
    {user ? (
      <>
        <Link to={`/userdashboard/${user.urlUsername}`}>
          <li className="bg-white text-black py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba] border rounded-md px-2 py-1">Dashboard</li>
        </Link>
        <Link to="/profile">
          <li className="bg-white text-black py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba] border rounded-md px-2 py-1">Profile</li>
        </Link>
        <Link to={`/contact/${user._id}`}>
          <li className="bg-white text-black py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba] border rounded-md px-2 py-1">Contact</li>
        </Link>
        {/* <Link to={`/chat/${user.urlUsername}`}>
          <li className="bg-white text-black py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba] border rounded-md px-2 py-1">Chat</li>
        </Link> */}
        {/* <Link to={`/learn/${user.urlUsername}`}>
          <li className="bg-white text-black py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba] border rounded-md px-2 py-1">Learn</li>
        </Link>
        <Link to={`/explore/${user.urlUsername}`}>
          <li className="bg-white text-black py-1 px-2 text-Bold rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba] border rounded-md px-2 py-1">Explore</li>
        </Link> */}
        <li onClick={handleSignOut} className="text-[#1c73ba] px-2 py-1 cursor-pointer">Sign Out</li>
        
      </>
      
    ) : (
      <>
        <Link to="/">
          <li className="">Home</li>
        </Link>
        <Link to="https://flaap.me/sign-in">

          <li className="">Sign In</li>
        </Link>
        <Link to="https://flaap.me/sign-up">
          <li className="">Sign Up</li>
        </Link>
      </>
    )}
  </>
);


export default function Navbar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setDrawerOpen(false);
      }
    };

    const throttleResize = () => {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(handleResize);
      } else {
        handleResize();
      }
    };

    window.addEventListener("resize", throttleResize);
    return () => {
      window.removeEventListener("resize", throttleResize);
    };
  }, [windowWidth]);

  const handleSignOut = async () => {
    try {
      dispatch({ type: 'SIGN_OUT_START' });

      const signOutData = {
        _id: user._id
      };

      const response = await fetch('https://backend.flaap.me/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signOutData)
      });

      const resData = await response.json();

      if (resData.success === false) {
        dispatch({ type: 'SIGN_OUT_FAILURE', payload: resData.message });
        return;
      }

      dispatch({ type: 'SIGN_OUT_SUCCESS' });
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate("/sign-in");

    } catch (error) {
      dispatch({ type: 'SIGN_OUT_FAILURE', payload: error.message });
    }
  };

  const navbarStyle = {
    backgroundColor: user ? user.user_colour || '#1c73ba' : '#1c73ba',
  };

  return (
    <header style={navbarStyle} className="py-4 sm:py-5 mb-0">
      <div className="max-w-[1170px] mx-auto flex justify-between px-6 items-center">
        <Link to="/">
          <img src="/images/flap_white.png" alt="Flap Logo" className="w-[70px] sm:w-[80px] ps-1" />
        </Link>
        <ul className="gap-8 text-white text-[0.9rem] items-center hidden md:flex">
          <MenuItems user={user} handleSignOut={handleSignOut} />
        </ul>
        <MenuOutlined
          className="text-white text-[1.6rem] sm:text-[2rem] visible md:hidden cursor-pointer"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        />
      </div>
      <Drawer
        title={<img src={FlapLogo} alt="Flap Logo" className="w-[80px] py-3" />}
        placement="right" // Changed from "left" to "right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={200}
        closable={false}
      >
        <ul className="gap-8 text-black text-[0.95rem] items-left flex flex-col font-['Montserrat'] font-medium">
          <MenuItems user={user} handleSignOut={handleSignOut} />
        </ul>
      </Drawer>
      <style>
        {`
          li {
            transition: background-color 0.3s, color 0.3s;
          }
          
          li:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #ffffff; 
          }

          .border {
            transition: transform 0.3s;
          }

          .border:hover {
            transform: scale(1.05); 
          }
        `}
      </style>
    </header>
  );
}
